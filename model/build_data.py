import argparse
import json
import math
import random
import urllib.request
from pathlib import Path

from nexus_model import ASSUMPTIONS, COMMODITIES, COMMODITY_LABEL, MODE_LABEL, Model, great_circle_km, topsis

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
INPUTS = HERE / "inputs"

PLAN_WEIGHTS = {"cost": 1 / 3, "co2": 1 / 3, "social": 1 / 3}
SUPPLIER_CRITERIA = [("cost_per_unit", "cost", 0.3), ("co2_per_unit", "cost", 0.3), ("transit_days", "cost", 0.1), ("social_score", "benefit", 0.3)]
REGIONS = ["All", "UAE", "Middle East", "Europe", "Asia Pacific", "Americas", "Africa"]
TECH_LABEL = {"pv": "Solar PV", "wind": "Wind"}


def write_methods_js():
    md = (ROOT / "docs" / "METHODS.md").read_text(encoding="utf-8")
    (ROOT / "docs" / "methods.js").write_text("window.NEXUS_METHODS = " + json.dumps(md, ensure_ascii=True) + ";\n", encoding="utf-8", newline="\n")


def refresh_weather(ports):
    for p in ports:
        url = ("https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&current=temperature_2m,wind_speed_10m" % (p["lat"], p["lon"]))
        try:
            with urllib.request.urlopen(url, timeout=5) as r:
                cur = json.loads(r.read().decode())["current"]
            p["temperature_c"] = cur["temperature_2m"]
            p["windspeed_kmh"] = cur["wind_speed_10m"]
            p["delay_risk"] = "High" if cur["wind_speed_10m"] > 45 else "Medium" if cur["wind_speed_10m"] > 30 else "Low"
            p["status"] = "Weather advisory" if p["delay_risk"] != "Low" else "Operational"
        except Exception as e:
            print("weather skipped for", p["port"], e)
    return ports


def fit_forecast(hist, horizon=30):
    n = len(hist)

    def feat(t):
        f = [1.0, t / n]
        for P in (28, 7):
            f += [math.sin(2 * math.pi * t / P), math.cos(2 * math.pi * t / P)]
        return f

    X = [feat(t + 1) for t in range(n)]
    k = len(X[0])
    M = [[sum(X[r][i] * X[r][j] for r in range(n)) for j in range(k)] + [sum(X[r][i] * hist[r] for r in range(n))] for i in range(k)]
    for c in range(k):
        piv = max(range(c, k), key=lambda r: abs(M[r][c]))
        M[c], M[piv] = M[piv], M[c]
        for r in range(k):
            if r != c:
                f = M[r][c] / M[c][c]
                M[r] = [M[r][j] - f * M[c][j] for j in range(k + 1)]
    beta = [M[i][k] / M[i][i] for i in range(k)]
    pred = lambda t: sum(a * v for a, v in zip(beta, feat(t)))
    sd = math.sqrt(sum((hist[t] - pred(t + 1)) ** 2 for t in range(n)) / (n - k))
    fc = [pred(n + 1 + d) for d in range(horizon)]
    return fc, [v + 1.2816 * sd for v in fc], [v - 1.2816 * sd for v in fc], sd


def synthetic_history(seed=42, days=60):
    rng = random.Random(seed)
    return [round(120 + d * 0.45 + 18 * math.sin(2 * math.pi * d / 28) + rng.uniform(-3.5, 3.5), 1) for d in range(days)]


def certifications(s):
    out = []
    if s["iso45001"] == 1:
        out.append("ISO 45001")
    elif s["iso45001"]:
        out.append("ISO 45001 (part of sites)")
    if s["ungc"] == 1:
        out.append("UN Global Compact")
    elif s["ungc"]:
        out.append("UN Global Compact (parent)")
    if s["audit"]:
        out.append("Independent social audit or rating")
    if s["forced_labour_flag"]:
        out.append("Named in forced-labour supply-chain research (2021)")
    return out


def supplier_rows(model):
    hubs = list(model.H.values())
    rows = []
    for s in model.all_suppliers.values():
        dem = [(h, h["demand_t"][s["category"]]) for h in hubs if h["demand_t"][s["category"]] > 0]
        tot = sum(d for _, d in dem) or 1
        km = sum(great_circle_km(s, h) * d for h, d in dem) / tot
        rows.append({
            "id": s["id"], "name": s["name"], "category": COMMODITY_LABEL[s["category"]], "category_key": s["category"],
            "location": s["location"], "country": s["country"], "region": s["region"], "lat": s["lat"], "lon": s["lon"],
            "cost_per_unit": round(s["price_usd_per_t"], 1), "co2_per_unit": round(s["co2_t_per_t"], 3),
            "transit_days": round(km * 1.3 / 600 + 3, 1), "social_score": s["social_score"],
            "capacity": round(s["capacity_t"]), "certifications": certifications(s["social"]),
            "esg_tier": "Company-specific carbon data" if s["carbon"].get("specific") else "Category average carbon data",
            "carbon_basis": s["carbon"]["basis"], "carbon_source": s["carbon"]["src"], "social_source": s["social"]["src"],
            "social_indicators": s["social"], "note": s.get("note"),
        })
    for cat in COMMODITIES:
        group = [r for r in rows if r["category_key"] == cat]
        sc = topsis([[r[c] for c, _, _ in SUPPLIER_CRITERIA] for r in group], [w for _, _, w in SUPPLIER_CRITERIA], [k for _, k, _ in SUPPLIER_CRITERIA])
        for r, v in zip(group, sc):
            r["topsis_score"] = round(v * 100, 1)
        for rank, r in enumerate(sorted(group, key=lambda r: -r["topsis_score"]), 1):
            r["rank"] = rank
    return sorted(rows, key=lambda r: (COMMODITIES.index(r["category_key"]), r["rank"]))


def plan_summary(r, sups):
    modes = {}
    for f in r["flows"]:
        modes[f["mode_class"]] = modes.get(f["mode_class"], 0) + f["tonnes"]
    total = sum(modes.values()) or 1
    mode_txt = ", ".join("%s %d%%" % (MODE_LABEL[m].split(" with ")[0], round(100 * u / total)) for m, u in sorted(modes.items(), key=lambda kv: -kv[1])[:3])
    return mode_txt, [sups[i]["name"] for i in r["suppliers"]]


def corridors_from(plan, model):
    agg = {}
    for f in plan["flows"]:
        a = agg.setdefault((f["source"], f["target"], f["mode_class"]), dict(f, tonnes=0.0))
        a["tonnes"] += f["tonnes"]
    out = []
    for (si, hi, mode), f in sorted(agg.items(), key=lambda kv: -kv[1]["tonnes"]):
        s, h = model.all_suppliers[si], model.H[hi]
        out.append({
            "source": si, "target": hi, "corridor": "%s to %s" % (s["location"], h["name"]),
            "commodity": COMMODITY_LABEL[s["category"]], "distance_km": f["distance_km"],
            "mode": MODE_LABEL[mode], "mode_class": mode,
            "ef_kg_per_tkm": round(f["co2_kg_per_t"] / max(f["distance_km"], 1), 4),
            "co2_kg_per_t": round(f["co2_kg_per_t"], 1), "transport_usd_per_t": round(f["transport_usd_per_t"], 2),
            "flow_tons": round(f["tonnes"]), "flow_units": round(f["tonnes"]),
            "status": "Balanced plan", "region": h["region"], "country": h["country"],
        })
    return out


def pillar_scores(plan, pay, front):
    soc_lo = min(p["social"] for p in front)

    def norm(v, best, worst):
        return round(100 * (worst - v) / (worst - best), 1) + 0.0 if worst != best else 100.0

    def scores(p):
        return {"Economic": norm(p["cost"], pay["min_cost"]["cost"], pay["min_co2"]["cost"]),
                "Environmental": norm(p["co2"], pay["min_co2"]["co2"], pay["min_cost"]["co2"]),
                "Social": norm(p["social"], pay["max_social"]["social"], soc_lo)}
    mine, base = scores(plan), scores(pay["min_cost"])
    desc = {"Economic": "Annual procurement and freight cost placed between the cheapest plan (100) and the lowest-carbon plan (0).",
            "Environmental": "Annual CO2e (product footprints plus well-to-wheel freight) placed between the lowest-carbon plan (100) and the cheapest plan (0).",
            "Social": "Tonnage-weighted supplier social score placed between the best achievable (100) and the weakest plan on the front (0)."}
    return [{"pillar": k, "score": max(0.0, min(100.0, mine[k])), "benchmark": max(0.0, min(100.0, base[k])), "desc": desc[k]} for k in ("Economic", "Environmental", "Social")]


def front_payload(model, pay, front, weights=PLAN_WEIGHTS):
    t = topsis([[p["total_cost"], p["co2"], p["social"]] for p in front], [weights["cost"], weights["co2"], weights["social"]], ["cost", "cost", "benefit"])
    bi = max(range(len(front)), key=lambda i: t[i])
    picks = {0: "Cheapest plan", len(front) - 1: "Lowest-carbon plan", bi: "Balanced plan (TOPSIS)"}
    for frac, name in ((0.25, "Carbon-aware plan"), (0.75, "Deep-decarbonisation plan")):
        k = min(range(len(front)), key=lambda i: abs(i - frac * (len(front) - 1)))
        if k not in picks:
            picks[k] = name
    out = []
    for i, p in enumerate(front):
        mode_txt, names = plan_summary(p, model.all_suppliers)
        out.append({"strategy": picks.get(i, "Efficient plan %d" % (i + 1)), "role": "representative" if i in picks else None,
                    "cost": round(p["cost"]), "co2": round(p["co2"], 1), "social": round(p["social"], 4), "topsis": round(t[i], 4),
                    "suppliers": p["suppliers"], "mode": mode_txt, "unmet_t": round(p["unmet_t"]),
                    "description": "%d suppliers: %s." % (len(names), ", ".join(names))})
    return bi, out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weather", action="store_true", help="refresh port weather from open-meteo")
    ap.add_argument("--points", type=int, default=15)
    ap.add_argument("--docs-only", action="store_true", help="only rebuild docs/methods.js from docs/METHODS.md")
    args = ap.parse_args()
    if args.docs_only:
        write_methods_js()
        return

    ports = json.loads((INPUTS / "ports.json").read_text(encoding="utf-8"))
    if args.weather:
        ports = refresh_weather(ports)
        (INPUTS / "ports.json").write_text(json.dumps(ports, indent=1), encoding="utf-8", newline="\n")

    model = Model()
    pay, front = model.front(args.points)
    bi, pareto = front_payload(model, pay, front)
    balanced = front[bi]
    try:
        from stochastic import run_stochastic
        risk = run_stochastic()
    except ImportError:
        risk = None

    hist = synthetic_history()
    fc, up, lo, sd = fit_forecast(hist)
    hubs_out = []
    for h in model.H.values():
        mw = sum(h["capacity_mw"].values())
        hubs_out.append({"id": h["id"], "name": h["name"], "location_name": h["country"], "country": h["country"], "region": h["region"],
                         "lat": h["lat"], "lon": h["lon"], "demand_annual_mw": mw, "demand_units": round(h["demand_total_t"]),
                         "demand_t": {COMMODITY_LABEL[k]: round(v) for k, v in h["demand_t"].items() if v > 0},
                         "project_type": " + ".join(TECH_LABEL[k] for k in h["capacity_mw"]),
                         "capacity_mw": h["capacity_mw"], "priority": 1 if mw >= 1000 else 2, "source": h["src"]})
    region_mw = {}
    for h in hubs_out:
        region_mw[h["region"]] = region_mw.get(h["region"], 0) + h["demand_annual_mw"]
    corridors = corridors_from(balanced, model)
    ref = model.ref
    data = {
        "metadata": {
            "title": "Cairn sustainable supplier selection and transport network dataset",
            "standards": "GHG Protocol Scope 3 categories 1 and 4; DESNZ 2024 conversion factors (well-to-wheel); JRC material intensities",
            "generated_by": "model/build_data.py",
            "unit": "tonne of product",
            "data_status": {
                "suppliers": "Real companies. Carbon intensity is company-specific where a disclosure was found and a stated category value otherwise; social score is a five-indicator rubric from public sources; prices are 2024 category market prices.",
                "hubs": "Real projects at published capacities; material demand from JRC intensities over an assumed 3-year build.",
                "transport_factors": "DESNZ 2024 tank-to-wheel plus well-to-tank per tonne-km; battery electric trucks from ICCT energy use and Ember grid intensity.",
                "capacity": "Each supplier may supply at most 40 percent of its category's demand (assumption).",
                "forecast": "Synthetic history (seeded) with a real least-squares forecast.",
                "weather": "open-meteo readings at the last refresh (build_data.py --weather).",
            },
            "bibliography": ref["bibliography"], "prices": ref["prices"], "material_t_per_mw": ref["material_t_per_mw"],
            "transport": ref["transport"], "grid_g_per_kwh": ref["grid_g_per_kwh"], "assumptions": dict(ASSUMPTIONS, **ref["assumptions"]),
            "plan_weights": PLAN_WEIGHTS,
            "payoff": {k: {"cost": round(v["cost"]), "co2_t": round(v["co2"], 1), "social": round(v["social"], 4), "suppliers": v["suppliers"]} for k, v in pay.items()},
        },
        "regions": REGIONS,
        "countries": sorted({s["country"] for s in model.all_suppliers.values()} | {h["country"] for h in model.H.values()}),
        "categories": [COMMODITY_LABEL[k] for k in COMMODITIES],
        "suppliers": supplier_rows(model),
        "demand_hubs": hubs_out,
        "telemetry": ports,
        "corridors": corridors,
        "pareto": pareto,
        "risk": risk,
        "forecast": {"days_history": list(range(1, 61)), "days_forecast": list(range(61, 91)), "historical_clean_units": hist,
                     "model_forecast_units": [round(v, 1) for v in fc], "confidence_upper": [round(v, 1) for v in up],
                     "confidence_lower": [round(v, 1) for v in lo], "unit_label": "MW-equivalent procurement per day (synthetic history)",
                     "model": "Least squares on trend plus 7 and 28 day Fourier terms; 80 percent interval from residual sd %.2f" % sd},
        "region_demand": [{"region": k, "demand_mw": round(v, 1)} for k, v in sorted(region_mw.items(), key=lambda kv: -kv[1])],
        "esg_pillars": pillar_scores(balanced, pay, front),
        "summary": {
            "total_suppliers": len(model.all_suppliers), "total_hubs": len(model.H), "total_corridors": len(corridors),
            "total_annual_demand_mw": sum(h["demand_annual_mw"] for h in hubs_out), "total_demand_t": round(model.demand),
            "annual_co2_abated_tons": round(pay["min_cost"]["co2"] - balanced["co2"], 1),
            "balanced_cost_usd": round(balanced["cost"]), "balanced_co2_t": round(balanced["co2"], 1),
            "balanced_social": round(balanced["social"], 4), "balanced_suppliers": len(balanced["suppliers"]),
        },
        "world_map_polygons": json.loads((INPUTS / "world_map_polygons.json").read_text(encoding="utf-8")),
        "world_map_lakes": json.loads((INPUTS / "world_map_lakes.json").read_text(encoding="utf-8")),
    }
    text = json.dumps(data, indent=1, ensure_ascii=True)
    (ROOT / "data.json").write_text(text + "\n", encoding="utf-8", newline="\n")
    (ROOT / "data.js").write_text("window.DASHBOARD_DATA = " + text + ";\n", encoding="utf-8", newline="\n")
    write_methods_js()
    print("front points", len(front), "balanced", round(balanced["cost"] / 1e6, 1), "M USD", round(balanced["co2"]), "t", round(balanced["social"], 3),
          "corridors", len(corridors), "risk", "yes" if risk else "no")


if __name__ == "__main__":
    main()
