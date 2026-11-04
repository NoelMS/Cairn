import math

from nexus_model import COMMODITIES, Model, load_inputs, topsis, transport_factors
from stochastic import run_stochastic


def check_plan(m, p):
    got, sent = {}, {}
    for f in p["flows"]:
        got[(f["target"], f["commodity"])] = got.get((f["target"], f["commodity"]), 0) + f["tonnes"]
        sent[f["source"]] = sent.get(f["source"], 0) + f["tonnes"]
    short = {(s["hub"], s["commodity"]): s["tonnes"] for s in p["unmet"]}
    for j, h in m.H.items():
        for c in COMMODITIES:
            assert abs(got.get((j, c), 0) + short.get((j, c), 0) - h["demand_t"][c]) < 1e-2, ("demand", j, c)
    for i, t in sent.items():
        assert t <= m.S[i]["capacity_t"] + 1e-3, ("capacity", i)
        assert i in p["suppliers"], ("flow from unselected supplier", i)
        assert t >= 500 - 1e-3, ("min order", i)


def check():
    m = Model()
    pay, front = m.front(6)
    for p in front + list(pay.values()):
        check_plan(m, p)
    assert pay["min_cost"]["unmet_t"] < 1, "baseline should meet all demand"
    for a, b in zip(front, front[1:]):
        assert a["total_cost"] <= b["total_cost"] + 1e-6 and a["co2"] >= b["co2"] - 1e-6, "front not monotone"
    for p in front:
        dominated = any(q is not p and q["total_cost"] <= p["total_cost"] and q["co2"] <= p["co2"] and
                        (q["total_cost"] < p["total_cost"] - 1 or q["co2"] < p["co2"] - 1e-3) for q in front)
        assert not dominated, "dominated point on front"

    wtw, kwh_tkm, loss = transport_factors(load_inputs()[2])
    assert math.isclose(wtw["rail"], 0.02779 + 0.00691, rel_tol=1e-6), "rail factor should be well-to-wheel"
    assert math.isclose(kwh_tkm, 1.2 / 8.95, rel_tol=1e-6) and 0 < loss < 0.2

    base = m.solve("cost")
    priced = Model({"carbon_price": 200}).solve("cost")
    assert priced["co2"] <= base["co2"] + 1e-3, "carbon price raised CO2e"
    off = ["SUP_FIRST_SOLAR", "SUP_SSAB"]
    r = Model({"disabled_suppliers": off}).solve("cost")
    assert not any(f["source"] in off for f in r["flows"]), "disabled supplier carries flow"
    r = Model({"disabled_modes": ["sea_container"]})
    assert not any(a["mode_class"] == "sea_container" for a in r.arcs), "disabled mode still present"
    check_plan(r, r.solve("cost"))
    r = Model({"demand_scale": {"UAE": 1.5}}).solve("cost")
    assert r["cost"] > base["cost"], "more demand should cost more"
    turb = [i for i, s in m.S.items() if s["category"] == "turbine"]
    mt = Model({"disabled_suppliers": turb})
    r = mt.solve("cost")
    need = sum(h["demand_t"]["turbine"] for h in mt.H.values())
    assert need > 0 and abs(r["unmet_t"] - need) < 1e-2, "with every turbine maker off, all turbine demand is unmet"

    flagged = [i for i, s in m.S.items() if s["social"]["forced_labour_flag"]]
    assert flagged and all(m.S[i]["social_score"] == 0 for i in flagged), "a forced-labour flag must zero the social score"
    assert not any(f["source"] in flagged for f in pay["max_social"]["flows"]), "best-social plan buys from a flagged supplier"
    r = Model({"disabled_suppliers": flagged}).solve("cost")
    assert r["unmet_t"] < 1, "screening out flagged suppliers should still meet demand"

    st = run_stochastic(n=6, seed=3)
    assert st["vss"] >= -1 and st["evpi"] >= -1, ("VSS and EVPI must be non-negative", st["vss"], st["evpi"])
    assert st["ws_expected_cost"] <= st["rp_expected_cost"] + 1 <= st["eev_expected_cost"] + 2
    assert st["rp_cvar90"] >= st["rp_var90"] - 1

    sc = topsis([[1, 9], [5, 5], [9, 1]], [0.5, 0.5], ["cost", "benefit"])
    assert sc[0] > sc[1] > sc[2] and abs(sc[0] - 1) < 1e-9
    assert math.isclose(topsis([[2, 2], [2, 2]], [0.5, 0.5], ["cost", "cost"])[0], 1.0)
    print("MODEL OK", len(front), "front points, VSS", st["vss"], "EVPI", st["evpi"])


if __name__ == "__main__":
    check()
