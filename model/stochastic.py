import math
import random

import pulp

from nexus_model import ASSUMPTIONS, COMMODITIES, Model, arcs_for

UNCERTAINTY = {
    "scenarios": 20,
    "seed": 7,
    "demand_sigma": 0.15,
    "supplier_outage_p": 0.05,
    "red_sea_closure_p": 0.15,
    "hormuz_closure_p": 0.05,
    "reservation_share_of_price": 0.05,
}


def sample_scenarios(model, n=None, seed=None):
    U = UNCERTAINTY
    rng = random.Random(U["seed"] if seed is None else seed)
    regions = sorted({h["region"] for h in model.H.values()})
    out = []
    for s in range(n or U["scenarios"]):
        sig = U["demand_sigma"]
        mult = {r: math.exp(rng.gauss(-sig * sig / 2, sig)) for r in regions}
        down = sorted(i for i in model.S if rng.random() < U["supplier_outage_p"])
        out.append({"p": 1.0 / (n or U["scenarios"]), "demand_mult": mult, "outages": down,
                    "red_sea_closed": rng.random() < U["red_sea_closure_p"], "hormuz_closed": rng.random() < U["hormuz_closure_p"]})
    return out


def mean_scenario(model):
    return {"p": 1.0, "demand_mult": {h["region"]: 1.0 for h in model.H.values()}, "outages": [], "red_sea_closed": False, "hormuz_closed": False}


class TwoStage:
    def __init__(self, model, scenarios):
        self.m = model
        self.scen = scenarios
        self.arcs = {}
        for s in scenarios:
            key = (s["red_sea_closed"], s["hormuz_closed"])
            if key not in self.arcs:
                flags = {"red_sea_closed": key[0] or bool(model.scenario.get("red_sea_closed")),
                         "hormuz_closed": key[1] or bool(model.scenario.get("hormuz_closed")),
                         "disabled_modes": model.scenario.get("disabled_modes", [])}
                self.arcs[key] = [a for sup in model.S.values() for h in model.H.values() if h["demand_t"][sup["category"]] > 0
                                  for a in arcs_for(sup, h, model.ref, flags)]

    def solve(self, fixed=None):
        A, m = ASSUMPTIONS, self.m
        p = pulp.LpProblem("twostage", pulp.LpMinimize)
        y = {i: pulp.LpVariable("y_" + i, cat="Binary") for i in m.S}
        r = {i: pulp.LpVariable("r_" + i, lowBound=0) for i in m.S}
        res_share = UNCERTAINTY["reservation_share_of_price"]
        first = pulp.lpSum(A["contract_fixed_usd"] * y[i] + res_share * m.S[i]["price_usd_per_t"] * r[i] for i in m.S)
        for i, s in m.S.items():
            p += r[i] <= s["capacity_t"] * y[i]
            p += r[i] >= A["min_order_t"] * y[i]
        if fixed:
            for i in m.S:
                p += y[i] == fixed["y"][i]
                p += r[i] == fixed["r"][i]
        second, scen_cost, scen_co2, scen_unmet = [], [], [], []
        for k, sc in enumerate(self.scen):
            arcs = self.arcs[(sc["red_sea_closed"], sc["hormuz_closed"])]
            x = [pulp.LpVariable("x_%d_%d" % (k, n), lowBound=0) for n in range(len(arcs))]
            u = {}
            by_need, by_sup = {}, {}
            for n, a in enumerate(arcs):
                by_need.setdefault((a["target"], a["commodity"]), []).append(x[n])
                by_sup.setdefault(a["source"], []).append(x[n])
            for j, h in m.H.items():
                mult = sc["demand_mult"][h["region"]]
                for c in COMMODITIES:
                    d = h["demand_t"][c] * mult
                    if d > 1e-9:
                        u[(j, c)] = pulp.LpVariable("u_%d_%s_%s" % (k, j, c), lowBound=0)
                        p += pulp.lpSum(by_need.get((j, c), [])) + u[(j, c)] == d
            for i in m.S:
                cap = 0 if i in sc["outages"] else 1
                p += pulp.lpSum(by_sup.get(i, [])) <= r[i] * cap
            cost = pulp.lpSum((m.S[a["source"]]["price_usd_per_t"] + a["transport_usd_per_t"]) * x[n] for n, a in enumerate(arcs)) + \
                pulp.lpSum(A["unmet_penalty_multiple"] * m.price_cap[c] * v for (j, c), v in u.items())
            co2 = pulp.lpSum((m.S[a["source"]]["co2_t_per_t"] * 1000 + a["co2_kg_per_t"]) * x[n] for n, a in enumerate(arcs)) / 1000.0
            second.append(sc["p"] * cost)
            scen_cost.append(cost)
            scen_co2.append(co2)
            scen_unmet.append(u)
        p += first + pulp.lpSum(second)
        p.solve(m.solver())
        if pulp.LpStatus[p.status] != "Optimal":
            return None
        fv = pulp.value(first)
        costs = [fv + pulp.value(c) for c in scen_cost]
        unmet_by_hub = {}
        for u in scen_unmet:
            for j in {j for (j, c), v in u.items() if (v.value() or 0) > 1e-3}:
                unmet_by_hub[j] = unmet_by_hub.get(j, 0) + 1
        return {"objective": pulp.value(p.objective), "first_stage": fv, "scenario_costs": costs,
                "scenario_co2": [pulp.value(c) for c in scen_co2],
                "unmet_t": [sum((v.value() or 0) for v in u.values()) for u in scen_unmet],
                "unmet_prob_by_hub": {j: n / len(self.scen) for j, n in unmet_by_hub.items()},
                "y": {i: round(y[i].value() or 0) for i in m.S}, "r": {i: (r[i].value() or 0) for i in m.S}}


def var_cvar(costs, probs, alpha=0.9):
    order = sorted(zip(costs, probs))
    acc, var = 0.0, order[-1][0]
    for c, p in order:
        acc += p
        if acc >= alpha - 1e-12:
            var = c
            break
    tail = [(c, p) for c, p in order if c >= var]
    w = sum(p for _, p in tail)
    return var, sum(c * p for c, p in tail) / w if w else var


def run_stochastic(scenario=None, n=None, seed=None, with_ws=True):
    model = Model(scenario)
    scen = sample_scenarios(model, n, seed)
    probs = [s["p"] for s in scen]
    rp = TwoStage(model, scen).solve()
    ev = TwoStage(model, [mean_scenario(model)]).solve()
    eev = TwoStage(model, scen).solve(fixed={"y": ev["y"], "r": ev["r"]})
    ws = None
    if with_ws:
        ws = sum(sc["p"] * TwoStage(model, [dict(sc, p=1.0)]).solve()["objective"] for sc in scen)
    var, cvar = var_cvar(rp["scenario_costs"], probs)
    evar, ecvar = var_cvar(eev["scenario_costs"], probs)
    names = {i: model.S[i]["name"] for i in model.S}
    return {
        "assumptions": UNCERTAINTY,
        "n_scenarios": len(scen),
        "scenario_summary": {"red_sea_closures": sum(s["red_sea_closed"] for s in scen), "hormuz_closures": sum(s["hormuz_closed"] for s in scen),
                             "supplier_outages": sum(len(s["outages"]) for s in scen)},
        "rp_expected_cost": round(rp["objective"]),
        "eev_expected_cost": round(eev["objective"]),
        "ws_expected_cost": round(ws) if ws is not None else None,
        "vss": round(eev["objective"] - rp["objective"]),
        "evpi": round(rp["objective"] - ws) if ws is not None else None,
        "rp_var90": round(var), "rp_cvar90": round(cvar), "ev_var90": round(evar), "ev_cvar90": round(ecvar),
        "rp_costs": [round(c) for c in rp["scenario_costs"]], "ev_costs": [round(c) for c in eev["scenario_costs"]],
        "rp_expected_co2_t": round(sum(c * p for c, p in zip(rp["scenario_co2"], probs)), 1),
        "rp_unmet_t": [round(v) for v in rp["unmet_t"]], "ev_unmet_t": [round(v) for v in eev["unmet_t"]],
        "rp_unmet_prob_by_hub": {model.H[j]["name"]: round(v, 3) for j, v in sorted(rp["unmet_prob_by_hub"].items(), key=lambda kv: -kv[1])},
        "ev_unmet_prob_by_hub": {model.H[j]["name"]: round(v, 3) for j, v in sorted(eev["unmet_prob_by_hub"].items(), key=lambda kv: -kv[1])},
        "rp_contracts": [{"supplier": names[i], "reserved_t": round(rp["r"][i])} for i in model.S if rp["y"][i]],
        "ev_contracts": [{"supplier": names[i], "reserved_t": round(ev["r"][i])} for i in model.S if ev["y"][i]],
    }
