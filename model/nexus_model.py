import json
import math
from pathlib import Path

import pulp

INPUTS = Path(__file__).resolve().parent / "inputs"
COMMODITIES = ["modules", "steel", "aluminium", "copper", "turbine"]
MODES = ["road_diesel", "road_bev", "rail", "sea_container"]
MODE_LABEL = {"road_diesel": "Diesel HGV", "road_bev": "Battery electric HGV", "rail": "Freight rail",
              "sea_container": "Container ship with road drayage"}
COMMODITY_LABEL = {"modules": "PV modules", "steel": "Steel", "aluminium": "Aluminium", "copper": "Copper cable",
                   "turbine": "Wind turbine components"}

ASSUMPTIONS = {
    "road_circuity": 1.25,
    "rail_circuity": 1.25,
    "sea_circuity": 1.35,
    "drayage_km_each_end": 150,
    "bev_max_road_km": 600,
    "road_max_km": 3500,
    "rail_max_km": 5000,
    "cost_usd_per_tkm": {"road_diesel": 0.12, "road_bev": 0.13, "rail": 0.05, "sea_container": 0.015},
    "contract_fixed_usd": 250000,
    "min_order_t": 500,
    "unmet_penalty_multiple": 10,
    "suez_detour_km": 6000,
}

LAND = {
    "UAE": "arabia", "Saudi Arabia": "arabia", "Qatar": "arabia",
    "Germany": "europe", "Netherlands": "europe", "Denmark": "europe", "Spain": "europe", "Sweden": "europe",
    "Norway": "europe", "Italy": "europe", "France": "europe",
    "China": "china", "India": "india", "South Korea": "korea", "Japan": "japan",
    "USA": "usa", "Brazil": "southam", "Chile": "southam",
    "Egypt": "eastafrica", "Kenya": "eastafrica", "Morocco": "maghreb",
    "UK": "offshore",
}
RAIL_LAND = {"europe", "china", "india", "japan", "usa"}
GULF_COUNTRIES = {"UAE", "Qatar"}
SUEZ_WEST = {"europe", "maghreb", "offshore", "usa", "southam"}
SUEZ_EAST = {"arabia", "india", "china", "korea", "japan"}


def load_inputs():
    rd = lambda n: json.loads((INPUTS / n).read_text(encoding="utf-8"))
    return rd("suppliers.json"), rd("hubs.json"), rd("reference.json")


def injury_score(inj):
    if not inj or inj.get("value") is None:
        return 0.0
    v = inj["value"]
    return 1.0 if v <= 0.5 else 0.8 if v <= 1.0 else 0.6 if v <= 2.0 else 0.4


def social_score(s):
    if s["forced_labour_flag"]:
        return 0.0
    parts = [s["iso45001"], s["ungc"], injury_score(s["injury"]), s["audit"], 1]
    return sum(parts) / len(parts)


def prepare(raw_suppliers, raw_hubs, ref):
    mat, price = ref["material_t_per_mw"], ref["prices"]
    module_t_per_mw = mat["pv"]["modules"]
    turbine_t_per_mw = mat["wind"]["turbine"]
    suppliers = []
    for s in raw_suppliers:
        p = price[s["price_key"]]
        if s["category"] == "modules":
            usd_t = p["usd_per_w"] * 1e6 / module_t_per_mw
        elif s["category"] == "turbine":
            usd_t = p["usd_per_mw"] / turbine_t_per_mw
        else:
            usd_t = p["usd_per_t"]
        suppliers.append(dict(s, price_usd_per_t=usd_t, social_score=round(social_score(s["social"]), 3)))
    spend = sorted(x["carbon"]["g_per_usd"] for x in suppliers if x["category"] == "turbine" and x["carbon"].get("g_per_usd"))
    median_g = spend[len(spend) // 2] if len(spend) % 2 else sum(spend[len(spend) // 2 - 1:len(spend) // 2 + 1]) / 2
    for x in suppliers:
        c = x["carbon"]
        if x["category"] == "modules":
            x["co2_t_per_t"] = c["kg_per_kwp"] / module_t_per_mw
        elif x["category"] == "turbine":
            g = c.get("g_per_usd") or median_g
            x["co2_t_per_t"] = g * x["price_usd_per_t"] / 1e6
            x["carbon_category_median"] = not c.get("g_per_usd")
        else:
            x["co2_t_per_t"] = c["t_per_t"]
    years = ref["assumptions"]["build_years"]
    hubs = []
    for h in raw_hubs:
        need = {k: 0.0 for k in COMMODITIES}
        for tech, mw in h["capacity_mw"].items():
            for k, v in mat["pv" if tech == "pv" else "wind"].items():
                if k in need:
                    need[k] += mw * v / years
        hubs.append(dict(h, demand_t=need, demand_total_t=sum(need.values())))
    share = ref["assumptions"]["max_share_per_supplier"]
    total = {k: sum(h["demand_t"][k] for h in hubs) for k in COMMODITIES}
    for x in suppliers:
        x["capacity_t"] = share * total[x["category"]]
    return suppliers, hubs, ref


def great_circle_km(a, b):
    r = math.pi / 180
    dlat = (b["lat"] - a["lat"]) * r
    dlon = (b["lon"] - a["lon"]) * r
    h = math.sin(dlat / 2) ** 2 + math.cos(a["lat"] * r) * math.cos(b["lat"] * r) * math.sin(dlon / 2) ** 2
    return 6371 * 2 * math.atan2(math.sqrt(h), math.sqrt(1 - h))


def transport_factors(ref):
    t = ref["transport"]
    wtw = {m: t["ttw_kg_per_tkm"][m] + t["wtt_kg_per_tkm"][m] for m in ("road_diesel", "rail", "sea_container")}
    e = t["electricity_uk"]
    loss = e["td_losses"] / e["generation"]
    kwh_tkm = t["bev"]["kwh_per_km"] / t["bev"]["payload_t"]
    return wtw, kwh_tkm, loss


def arcs_for(sup, hub, ref, scenario):
    A = ASSUMPTIONS
    wtw, kwh_tkm, loss = transport_factors(ref)
    grid = ref["grid_g_per_kwh"].get(sup["country"], 450) / 1000.0
    ef = dict(wtw, road_bev=kwh_tkm * grid * (1 + loss))
    gc = great_circle_km(sup, hub)
    ls, lh = LAND.get(sup["country"]), LAND.get(hub["country"])
    same = ls == lh and lh != "offshore"
    off = set(scenario.get("disabled_modes", []))
    out = []

    def arc(mode, legs):
        if mode in off:
            return
        out.append({"source": sup["id"], "target": hub["id"], "commodity": sup["category"], "mode_class": mode,
                    "distance_km": round(sum(d for _, d in legs)),
                    "co2_kg_per_t": sum(ef[k] * d for k, d in legs),
                    "transport_usd_per_t": sum(A["cost_usd_per_tkm"][k] * d for k, d in legs)})

    road = gc * A["road_circuity"]
    if same and road <= A["road_max_km"]:
        arc("road_diesel", [("road_diesel", road)])
        if road <= A["bev_max_road_km"]:
            arc("road_bev", [("road_bev", road)])
    rail = gc * A["rail_circuity"]
    if same and lh in RAIL_LAND and rail <= A["rail_max_km"] and gc > 150:
        arc("rail", [("rail", rail)])
    if not same or gc > 1500:
        hormuz = scenario.get("hormuz_closed") and (sup["country"] in GULF_COUNTRIES or hub["country"] in GULF_COUNTRIES)
        if not hormuz:
            sea = gc * A["sea_circuity"]
            if scenario.get("red_sea_closed") and ((ls in SUEZ_WEST and lh in SUEZ_EAST) or (ls in SUEZ_EAST and lh in SUEZ_WEST)):
                sea += A["suez_detour_km"]
            arc("sea_container", [("sea_container", sea), ("road_diesel", 2 * A["drayage_km_each_end"])])
    return out


class Model:
    def __init__(self, scenario=None, inputs=None):
        self.scenario = scenario or {}
        raw_s, raw_h, ref = inputs or load_inputs()
        suppliers, hubs, ref = prepare(raw_s, raw_h, ref)
        off = set(self.scenario.get("disabled_suppliers", []))
        scale = self.scenario.get("demand_scale", {})
        for h in hubs:
            m = scale.get(h["region"], 1.0)
            h["demand_t"] = {k: v * m for k, v in h["demand_t"].items()}
            h["demand_total_t"] = sum(h["demand_t"].values())
        self.ref = ref
        self.all_suppliers = {s["id"]: s for s in suppliers}
        self.S = {s["id"]: s for s in suppliers if s["id"] not in off}
        self.H = {h["id"]: h for h in hubs}
        self.arcs = [a for s in self.S.values() for h in hubs if h["demand_t"][s["category"]] > 0 for a in arcs_for(s, h, ref, self.scenario)]
        self.need = [(j, k) for j, h in self.H.items() for k in COMMODITIES if h["demand_t"][k] > 1e-9]
        self.demand = sum(self.H[j]["demand_t"][k] for j, k in self.need)
        self.price_cap = {k: max([s["price_usd_per_t"] for s in self.all_suppliers.values() if s["category"] == k] or [0]) for k in COMMODITIES}
        self._unmet_floor = None

    def solver(self):
        try:
            h = pulp.HiGHS(msg=False)
            if h.available():
                return h
        except Exception:
            pass
        return pulp.PULP_CBC_CMD(msg=False)

    def build(self, sense):
        A = ASSUMPTIONS
        p = pulp.LpProblem("nexus", sense)
        x = [pulp.LpVariable("x%d" % k, lowBound=0) for k in range(len(self.arcs))]
        u = {(j, k): pulp.LpVariable("u_%s_%s" % (j, k), lowBound=0) for j, k in self.need}
        y = {i: pulp.LpVariable("y_" + i, cat="Binary") for i in self.S}
        cost = pulp.lpSum(A["contract_fixed_usd"] * y[i] for i in self.S) + pulp.lpSum(
            (self.S[a["source"]]["price_usd_per_t"] + a["transport_usd_per_t"]) * x[n] for n, a in enumerate(self.arcs))
        penalty = pulp.lpSum(A["unmet_penalty_multiple"] * self.price_cap[k] * u[(j, k)] for j, k in self.need)
        co2 = pulp.lpSum((self.S[a["source"]]["co2_t_per_t"] * 1000 + a["co2_kg_per_t"]) * x[n] for n, a in enumerate(self.arcs)) / 1000.0
        social = pulp.lpSum(self.S[a["source"]]["social_score"] * x[n] for n, a in enumerate(self.arcs)) / max(self.demand, 1)
        unmet = pulp.lpSum(u.values())
        by_need = {}
        for n, a in enumerate(self.arcs):
            by_need.setdefault((a["target"], a["commodity"]), []).append(x[n])
        by_sup = {}
        for n, a in enumerate(self.arcs):
            by_sup.setdefault(a["source"], []).append(x[n])
        for j, k in self.need:
            p += pulp.lpSum(by_need.get((j, k), [])) + u[(j, k)] == self.H[j]["demand_t"][k]
        for i, s in self.S.items():
            out = pulp.lpSum(by_sup.get(i, []))
            p += out <= s["capacity_t"] * y[i]
            p += out >= ASSUMPTIONS["min_order_t"] * y[i]
        return p, x, u, y, cost, penalty, co2, social, unmet

    def unmet_floor(self):
        if self._unmet_floor is None:
            p, x, u, y, cost, penalty, co2, social, unmet = self.build(pulp.LpMinimize)
            p += unmet
            p.solve(self.solver())
            self._unmet_floor = pulp.value(unmet) or 0.0
        return self._unmet_floor

    def solve(self, objective, eps_co2_t=None, max_cost=None, min_social=None):
        sense = pulp.LpMaximize if objective == "social" else pulp.LpMinimize
        p, x, u, y, cost, penalty, co2, social, unmet = self.build(sense)
        price = float(self.scenario.get("carbon_price", 0) or 0)
        total = cost + penalty + price * co2
        p += {"cost": total, "co2": co2, "social": social}[objective]
        p += unmet <= self.unmet_floor() * (1 + 1e-7) + 1e-4
        if eps_co2_t is not None:
            p += co2 <= eps_co2_t
        if max_cost is not None:
            p += total <= max_cost
        floor = min_social if min_social is not None else self.scenario.get("min_social")
        if floor is not None:
            p += social >= floor
        p.solve(self.solver())
        if pulp.LpStatus[p.status] != "Optimal":
            return None
        flows = [dict(a, tonnes=x[n].value()) for n, a in enumerate(self.arcs) if x[n].value() and x[n].value() > 1e-6]
        short = [{"hub": j, "commodity": k, "tonnes": u[(j, k)].value()} for j, k in self.need if u[(j, k)].value() and u[(j, k)].value() > 1e-6]
        return {"cost": pulp.value(cost), "total_cost": pulp.value(total), "co2": pulp.value(co2), "social": pulp.value(social),
                "carbon_cost": price * pulp.value(co2), "penalty": pulp.value(penalty),
                "suppliers": sorted(i for i in self.S if y[i].value() > 0.5), "flows": flows, "unmet": short,
                "unmet_t": sum(s["tonnes"] for s in short)}

    def efficient(self, eps_co2_t=None, tiebreak=True):
        first = self.solve("cost", eps_co2_t=eps_co2_t)
        if first is None or not tiebreak:
            return first
        second = self.solve("social", eps_co2_t=eps_co2_t, max_cost=first["total_cost"] * (1 + 1e-6) + 1e-3)
        return second or first

    def payoff(self, tiebreak=True):
        c = self.efficient(tiebreak=tiebreak)
        e = self.solve("co2")
        e = self.solve("cost", eps_co2_t=e["co2"] * (1 + 1e-6) + 1e-6) or e
        s = self.solve("social")
        return {"min_cost": c, "min_co2": e, "max_social": s}

    def front(self, n=15, tiebreak=True):
        pay = self.payoff(tiebreak)
        hi, lo = pay["min_cost"]["co2"], pay["min_co2"]["co2"]
        pts = []
        for k in range(n):
            eps = hi - (hi - lo) * k / (n - 1)
            r = self.efficient(eps_co2_t=eps * (1 + 1e-6) + 1e-6, tiebreak=tiebreak)
            if r and not any(abs(r["total_cost"] - q["total_cost"]) < 1 and abs(r["co2"] - q["co2"]) < 0.01 for q in pts):
                r["eps_co2_t"] = eps
                pts.append(r)
        pts.sort(key=lambda r: r["total_cost"])
        return pay, pts


def topsis(rows, weights, kinds):
    n = len(rows[0])
    norms = [math.sqrt(sum(r[j] ** 2 for r in rows)) or 1.0 for j in range(n)]
    v = [[weights[j] * r[j] / norms[j] for j in range(n)] for r in rows]
    best = [(min if kinds[j] == "cost" else max)(row[j] for row in v) for j in range(n)]
    worst = [(max if kinds[j] == "cost" else min)(row[j] for row in v) for j in range(n)]
    out = []
    for row in v:
        dp = math.sqrt(sum((row[j] - best[j]) ** 2 for j in range(n)))
        dn = math.sqrt(sum((row[j] - worst[j]) ** 2 for j in range(n)))
        out.append(dn / (dp + dn) if dp + dn > 0 else 1.0)
    return out
