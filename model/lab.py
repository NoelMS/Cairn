import threading

from build_data import PLAN_WEIGHTS, corridors_from, front_payload, pillar_scores
from nexus_model import MODE_LABEL, MODES, Model

REGIONS = ["UAE", "Middle East", "Europe", "Asia Pacific", "Americas", "Africa"]
LOCK = threading.Lock()
_BASE = {}


class BadRequest(ValueError):
    pass


def _num(v, lo, hi, name):
    if isinstance(v, bool) or not isinstance(v, (int, float)) or not lo <= v <= hi:
        raise BadRequest("%s must be a number from %s to %s" % (name, lo, hi))
    return float(v)


def validate(body, supplier_ids):
    if not isinstance(body, dict):
        raise BadRequest("body must be a JSON object")
    sc = body.get("scenario") or {}
    if not isinstance(sc, dict):
        raise BadRequest("scenario must be an object")
    unknown = set(sc) - {"disabled_suppliers", "disabled_modes", "demand_scale", "carbon_price", "min_social", "red_sea_closed", "hormuz_closed"}
    if unknown:
        raise BadRequest("unknown scenario field: " + ", ".join(sorted(unknown)))
    out = {}
    ds = sc.get("disabled_suppliers", [])
    if not isinstance(ds, list) or any(i not in supplier_ids for i in ds):
        raise BadRequest("disabled_suppliers must list known supplier ids")
    out["disabled_suppliers"] = sorted(set(ds))
    dm = sc.get("disabled_modes", [])
    if not isinstance(dm, list) or any(m not in MODES for m in dm):
        raise BadRequest("disabled_modes must be a subset of " + ", ".join(MODES))
    out["disabled_modes"] = sorted(set(dm))
    scale = sc.get("demand_scale", {})
    if not isinstance(scale, dict) or any(r not in REGIONS for r in scale):
        raise BadRequest("demand_scale keys must be regions: " + ", ".join(REGIONS))
    out["demand_scale"] = {r: _num(v, 0.5, 2, "demand_scale." + r) for r, v in scale.items()}
    out["carbon_price"] = _num(sc.get("carbon_price", 0), 0, 1000, "carbon_price")
    if sc.get("min_social") is not None:
        out["min_social"] = _num(sc["min_social"], 0, 1, "min_social")
    for k in ("red_sea_closed", "hormuz_closed"):
        if not isinstance(sc.get(k, False), bool):
            raise BadRequest(k + " must be true or false")
        out[k] = sc.get(k, False)
    w = body.get("weights") or PLAN_WEIGHTS
    if not isinstance(w, dict) or set(w) != {"cost", "co2", "social"}:
        raise BadRequest("weights must have cost, co2 and social")
    w = {k: _num(v, 0, 1, "weights." + k) for k, v in w.items()}
    if sum(w.values()) <= 0:
        raise BadRequest("weights must not all be zero")
    s = sum(w.values())
    return out, {k: v / s for k, v in w.items()}, bool(body.get("stochastic"))


def mode_shares(plan):
    t = {}
    for f in plan["flows"]:
        t[f["mode_class"]] = t.get(f["mode_class"], 0) + f["tonnes"]
    tot = sum(t.values()) or 1
    return {m: round(v / tot, 4) for m, v in t.items()}


def supplier_tonnes(plan):
    t = {}
    for f in plan["flows"]:
        t[f["source"]] = t.get(f["source"], 0) + f["tonnes"]
    return t


def what_changed(base, cur, model):
    out = []
    bs, cs = supplier_tonnes(base), supplier_tonnes(cur)
    name = lambda i: model.all_suppliers[i]["name"]
    for i in sorted(set(cs) - set(bs), key=lambda i: -cs[i]):
        out.append("%s added (%s t a year)" % (name(i), format(round(cs[i]), ",")))
    for i in sorted(set(bs) - set(cs), key=lambda i: -bs[i]):
        out.append("%s dropped (was %s t a year)" % (name(i), format(round(bs[i]), ",")))
    moved = sorted(((cs[i] - bs[i], i) for i in set(bs) & set(cs) if abs(cs[i] - bs[i]) > 1000), key=lambda d: -abs(d[0]))
    for d, i in moved[:4]:
        out.append("%s %s%s t a year" % (name(i), "+" if d > 0 else "-", format(round(abs(d)), ",")))
    bm, cm = mode_shares(base), mode_shares(cur)
    for m in MODES:
        a, b = round(100 * bm.get(m, 0)), round(100 * cm.get(m, 0))
        if abs(a - b) >= 2:
            out.append("%s share %s from %d%% to %d%%" % (MODE_LABEL[m].split(" with ")[0], "rose" if b > a else "fell", a, b))
    if cur["unmet_t"] > 1:
        out.append("%s t a year of demand cannot be met" % format(round(cur["unmet_t"]), ","))
    return out or ["No change in suppliers, tonnages or modes"]


def plan_view(model, pay, front, p, anchors=None):
    unmet = {}
    for s in p["unmet"]:
        h = model.H[s["hub"]]["name"]
        unmet[h] = unmet.get(h, 0) + s["tonnes"]
    return {
        "kpi": {"cost": round(p["cost"]), "total_cost": round(p["total_cost"]), "co2": round(p["co2"], 1), "social": round(p["social"], 4),
                "carbon_cost": round(p["carbon_cost"]), "unmet_t": round(p["unmet_t"]),
                "unmet_by_hub": {k: round(v) for k, v in sorted(unmet.items(), key=lambda kv: -kv[1]) if v >= 1},
                "suppliers": [model.all_suppliers[i]["name"] for i in p["suppliers"]], "mode_shares": mode_shares(p)},
        "pillars": pillar_scores(p, *(anchors or (pay, front))),
        "allocation": corridors_from(p, model),
    }


def compare(bm, bp, m, cp):
    d_cost, d_co2 = cp["cost"] - bp["cost"], cp["co2"] - bp["co2"]
    return {"cost": round(d_cost), "co2": round(d_co2, 1), "social": round(cp["social"] - bp["social"], 4),
            "usd_per_t_avoided": round(d_cost / -d_co2, 1) if d_co2 < -1 and cp["unmet_t"] <= 1 else None,
            "unmet_t": round(cp["unmet_t"]), "like_for_like": cp["unmet_t"] <= 1, "changes": what_changed(bp, cp, m)}


def baseline(points):
    if points not in _BASE:
        m = Model()
        pay, front = m.front(points, tiebreak=False)
        _BASE[points] = (m, pay, front)
    return _BASE[points]


def solve_scenario(scenario, weights=None, points=9, stochastic=False):
    weights = weights or PLAN_WEIGHTS
    with LOCK:
        bm, bpay, bfront = baseline(points)
        m = Model(scenario)
        pay, front = m.front(points, tiebreak=False)
        risk = None
        if stochastic:
            from stochastic import run_stochastic
            risk = run_stochastic(scenario, with_ws=False)
    bi, bpts = front_payload(bm, bpay, bfront, weights)
    ci, cpts = front_payload(m, pay, front, weights)
    views = {}
    for name, b, c in (("balanced", bi, ci), ("cheapest", 0, 0)):
        views[name] = {"baseline": plan_view(bm, bpay, bfront, bfront[b]), "result": plan_view(m, pay, front, front[c], (bpay, bfront)),
                       "baseline_index": b, "result_index": c, "delta": compare(bm, bfront[b], m, front[c])}
    return {"scenario": scenario, "weights": weights, "baseline_front": bpts, "front": cpts, "views": views, "risk": risk}


if __name__ == "__main__":
    import time
    ids = {s for s in Model().all_suppliers}
    for bad in [[], {"scenario": {"carbon_price": 5000}}, {"scenario": {"disabled_suppliers": ["X"]}}, {"scenario": {"demand_scale": {"Mars": 1}}},
                {"scenario": {"foo": 1}}, {"weights": {"cost": 0, "co2": 0, "social": 0}}]:
        try:
            validate(bad, ids)
            raise AssertionError("accepted %r" % bad)
        except BadRequest:
            pass
    t = time.time()
    sc, w, _ = validate({"scenario": {"carbon_price": 100}}, ids)
    r = solve_scenario(sc, w)
    print(round(time.time() - t, 1), "s", r["views"]["balanced"]["delta"], r["views"]["cheapest"]["delta"])
    t = time.time()
    sc, w, _ = validate({"scenario": {"disabled_suppliers": ["SUP_JINKO", "SUP_LONGI", "SUP_TRINA", "SUP_ADANI"]}}, ids)
    r = solve_scenario(sc, w)
    print(round(time.time() - t, 1), "s", r["views"]["balanced"]["delta"], r["views"]["cheapest"]["delta"])
    v = r["views"]["balanced"]
    assert v["result"]["kpi"]["co2"] > 0 and not any(f["source"] in sc["disabled_suppliers"] for f in v["result"]["allocation"])
    assert not v["delta"]["like_for_like"] and v["delta"]["usd_per_t_avoided"] is None
    print("LAB OK")
