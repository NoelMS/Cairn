# Cairn: methods report

Sustainable supplier selection and transport network design with economic, environmental and social pillars, on real suppliers and real renewable projects.

Status: model, data pipeline and results as of 18 October 2026. Every number in this report comes from `model/build_data.py`, `model/stochastic.py` or `model/lab.py` and can be regenerated with the commands in section 12.

## 1. Purpose and scope

Cairn answers one planning question: given candidate manufacturers of clean-energy equipment and a portfolio of solar and wind projects, which suppliers should be contracted, how many tonnes of each product should each send to each project, and by which transport mode, when cost, carbon and social performance all matter?

The project has four parts:

1. An integrated optimisation model (Python, `model/`) that solves the question as a multi-commodity, multi-objective mixed-integer program and returns a front of efficient plans plus one balanced plan.
2. A two-stage stochastic extension (`model/stochastic.py`) that fixes contracts before demand and disruptions are known and measures what that robustness is worth.
3. A Scenario lab (`lab.js`, served by `run.py`) that re-solves the full model on demand: close a sea lane, lose suppliers, ban a transport mode, scale demand or price carbon, and see what changes.
4. A decision suite (`greenchainml/`) that shows the baseline results: supplier rankings (TOPSIS, with AHP for the weights), the trade-off front, routes, pillar scores and the risk analysis. A small Fleet routing exercise (`routing.js`) covers last-mile depot choice and fleet mix.

## 2. Data

All inputs live in `model/inputs/` and are assembled into one dataset (`data.json`, with a `data.js` copy for the browser) by `model/build_data.py`. Every value carries a source key; the full bibliography is in the dataset metadata and in the references below.

| Data | Count | Status |
|---|---|---|
| Suppliers | 21 | Real manufacturers in five product categories. Carbon intensity is supplier-specific where a disclosure was found and a stated category value otherwise. Social score from a published-indicator rubric. Prices are 2024 category market prices. |
| Projects | 19 | Real solar and wind projects at published capacities and true positions, in six regions. |
| Material intensity | 9 values | JRC (Carrara et al. 2020) tonnes of equipment per MW for PV and wind. |
| Transport factors | 4 modes | DESNZ 2024 tank-to-wheel and well-to-tank factors; battery electric trucks from ICCT energy use and Ember grid intensity. |
| Ports | 20 | Real ports at true positions; weather from open-meteo at the last refresh, context only. |

### 2.1 Products and demand

The model plans five products, in tonnes a year: PV modules, structural steel, aluminium, copper cable and wind turbine components. A project's demand is its capacity times the JRC material intensity, spread over an assumed three-year build.

| Technology | Modules | Steel | Aluminium | Copper | Turbine components |
|---|---|---|---|---|---|
| Solar PV (t per MW) | 59.0 | 67.9 | 7.5 | 4.6 | |
| Wind (t per MW) | | 119.5 | 1.05 | 2.1 | 8.0 |

The 19 projects total 25,610 MW, giving 1,166,623 t a year of demand: 703,067 t steel, 362,535 t modules, 48,597 t aluminium, 33,289 t copper cable and 19,136 t turbine components. Projects include MBR Solar Park Phase 6, Al Dhafra, Noor Abu Dhabi and Khazna (UAE); Sudair, Al Kharsaah, NEOM and Red Sea (Middle East); Witznitz, Nunez de Balboa and Dogger Bank (Europe); Bhadla and Akita-Noshiro (Asia Pacific); Edwards and Sanborn, Samson, Empire Wind and Lagoa dos Ventos (Americas); Benban and Lake Turkana (Africa).

### 2.2 Prices

Companies do not publish unit prices, so each supplier is priced at its category's 2024 market price. This is flagged in the dataset.

| Category | Price | Source |
|---|---|---|
| PV modules, Asian makers | USD 0.100 per W (1,695 USD/t) | OPIS Chinese Module Marker, FOB China, July 2024 |
| PV modules, US-made | USD 0.29 per W (4,915 USD/t) | NREL, average US module price Q3 2024 |
| Steel, UAE | USD 513.2/t | SteelOrbis, hot rolled coil FOB, 2024 average |
| Steel, Europe | EUR 641.68/t (USD 694.55/t) | SteelOrbis EU domestic HRC, 2024 average, ECB rate 1.0824 |
| Aluminium | USD 2,419.02/t | World Bank, 2024 annual average |
| Copper cable | USD 9,142.14/t (cathode) | World Bank, 2024 annual average |
| Turbine components | EUR 1.18m per MW (159,654 USD/t) | Vestas average selling price of order intake, Q4 2024 |

### 2.3 Manufacturing carbon intensity

| Supplier | t CO2e per t | Basis |
|---|---|---|
| EMSTEEL (UAE) | 0.637 | Scope 1+2 intensity of DRI-EAF steel, 2025 sustainability report |
| SSAB (Sweden) | 1.462 | (Scope 1 9,483 kt + Scope 2 1,260 kt) / 7,349 kt crude steel, 2024 |
| Tata Steel Nederland | 1.743 | Scope 1 only: 12.6 Mt at 7.23 Mt capacity |
| Norsk Hydro (Norway) | 4.0 | Certified primary aluminium footprint, upper bound |
| Emirates Global Aluminium | 7.57 | Scope 1+2 intensity of UAE metal, 2024 |
| Ma'aden Aluminium | 9.41 | Smelter intensity, liquid aluminium, 2024 |
| Five copper cable makers | 3.965 | Category value: International Copper Association cathode profile |
| JinkoSolar, LONGi, Trina, Qcells, Adani | 6.983 | Category value: 412 kg CO2e per kWp (Yuan et al. 2024, bifacial PERC, Chinese grid) |
| First Solar (USA) | 6.78 | Upper bound: EPEAT Climate+ threshold, 400 kg CO2e per kWp |
| Vestas | 0.895 | Spend-based: Scope 1+2 0.105 Mt / revenue EUR 17.3bn, times price |
| GE Vernova | 1.959 | Spend-based: Scope 1+2 428,213 t / revenue USD 34.9bn, times price |
| Siemens Gamesa, Goldwind | 1.427 | Not disclosed separately; category median |

Eight of 21 suppliers have supplier-specific values (Hydro's is a certified upper bound); the other 13 use a stated category value or, for First Solar, a certification upper bound. Spend-based turbine values divide company Scope 1+2 emissions by revenue, so they cover the maker's own operations only, not purchased steel.

### 2.4 Social score

Each supplier is scored 0 to 1 on five published indicators with equal weights of 0.2: ISO 45001 certification, UN Global Compact participation, a lost-time or recordable injury rate band (1.0 at or below 0.5, 0.8 at or below 1.0, 0.6 at or below 2.0, 0.4 above, 0 if not disclosed), an independent social audit (for example SA8000 or RBA), and the absence of a forced-labour flag in published supply-chain research (Sheffield Hallam University 2021 flags JinkoSolar, LONGi and Trina). The flag is non-compensatory: a flagged supplier scores 0 whatever its other indicators, because certificates and audits cannot offset a credible forced-labour link. This follows the logic of the US Uyghur Forced Labor Prevention Act (a rebuttable presumption that such goods are barred) and the EU Forced Labour Regulation (EU) 2024/3015 (a ban on placing such products on the EU market from December 2027). Under the earlier equal-weight average the flag was worth only 0.2, and LONGi and Trina (0.4) outscored unflagged Qcells and Adani (0.2). Other scores range from 0.2 (Qcells, Adani, Ducab) to 0.96 (SSAB). Missing disclosures score 0, so the rubric rewards transparency as well as performance.

### 2.5 Capacity and other assumptions

Each supplier may supply at most 40 percent of its category's total demand. This is a modelling assumption that forces diversification, not a disclosed capacity. The contract fixed cost (250,000 USD a year), minimum order (500 t) and transport cost rates are also assumptions, recorded in `ASSUMPTIONS` in `model/nexus_model.py`.

## 3. Transport emission factors

Factors are well-to-wheel (tank-to-wheel plus well-to-tank) in kg CO2e per tonne-km, from the UK DESNZ greenhouse gas conversion factors 2024 (flat file v1.1), in line with ISO 14083 and the GLEC Framework.

| Mode | Tank-to-wheel | Well-to-tank | Well-to-wheel | DESNZ rows |
|---|---|---|---|---|
| Diesel HGV, average laden | 0.09752 | 0.02359 | 0.12111 | 27_304_3140_14_1, 28_907_3140_14_1 |
| Freight rail | 0.02779 | 0.00691 | 0.03470 | 27_315_3151_14_1, 28_911_3151_14_1 |
| Container ship, average | 0.01612 | 0.00365 | 0.01977 | 27_320_3235_14_1, 28_916_3235_14_1 |
| Battery electric HGV | 0 | grid | country specific | see below |

Battery electric trucks use 1.2 kWh per km (midpoint of the 0.92 to 1.50 kWh/km measured in European fleets by the ICCT) divided by an average payload of 8.95 t (the payload implied by the DESNZ per-km and per-tonne-km diesel factors), times the grid intensity of the supplier's country (Ember, latest year: for example UAE 467.5, China 525.3, Sweden 35.3 g CO2e/kWh), plus 8.8 percent transmission and distribution losses (DESNZ UK ratio). An electric truck in Sweden emits about 0.005 kg CO2e per tonne-km; in Saudi Arabia about 0.10, close to diesel.

The Fleet routing exercise uses per-vehicle-km factors: diesel 1.085 kg CO2e/km (DESNZ 0.873 tank-to-wheel plus 0.212 well-to-tank) and electric 1.2 kWh/km at the grid of the region (UAE 0.611, Netherlands 0.331, China 0.686 kg CO2e/km).

## 4. Network: arcs and modes

For every supplier i and project j where j needs i's product, the model generates one arc per allowed mode from the great-circle distance d.

| Mode | Allowed when | Distance used |
|---|---|---|
| Diesel road | Same land group, road distance at most 3,500 km | 1.25 d |
| Electric road | Same land group, road distance at most 600 km | 1.25 d |
| Rail | Same land group with a freight rail network (Europe, USA, China, India, Japan), d above 150 km, at most 5,000 km | 1.25 d |
| Sea | Different land groups, or d above 1,500 km | 1.35 d at sea plus 150 km of diesel drayage at each end |

Land groups join countries reachable overland (the Arabian peninsula, mainland Europe, North Africa, East Africa, South America, and single-country groups). Dogger Bank (UK North Sea) is reachable by sea only; other offshore projects are treated as part of their country's land group, served through the nearest port. The baseline network has 359 arcs. Circuity factors, drayage and range limits are assumptions.

## 5. Optimisation model

### Sets

- I: suppliers; J: projects; K: products; A: arcs, each with a source s(a), a target t(a), a product k(a) and a mode.

### Parameters

- D_jk: annual demand of project j for product k (t)
- K_i: annual capacity of supplier i (t)
- c_i: price of supplier i (USD per t); e_i: manufacturing emissions (t CO2e per t); sigma_i: social score (0 to 1)
- tc_a, te_a: transport cost (USD per t) and well-to-wheel emissions (kg CO2e per t) on arc a, summed over its legs
- F: contract fixed cost; q: minimum order; P_k: unmet-demand penalty, 10 times the highest price in category k; p: carbon price (USD per t CO2e, 0 in the baseline)

### Decision variables

- x_a >= 0: tonnes shipped on arc a per year
- u_jk >= 0: unmet demand of project j for product k
- y_i in {0, 1}: 1 if supplier i is contracted

### Objectives

- Economic: minimise Z1 = sum_i F y_i + sum_a (c_s(a) + tc_a) x_a + sum_jk P_k u_jk + p Z2
- Environmental: minimise Z2 = sum_a (1000 e_s(a) + te_a) x_a / 1000 (t CO2e, products plus freight)
- Social: maximise Z3 = sum_a sigma_s(a) x_a / sum_jk D_jk (tonnage-weighted social score)

### Constraints

- Demand: for every j and k, the sum of x_a into j for product k plus u_jk equals D_jk
- Capacity and selection: for every i, the sum of x_a out of i is at most K_i y_i
- Minimum order: for every i, the sum of x_a out of i is at least q y_i
- Unmet floor: total unmet demand is first minimised on its own; every later solve keeps it at that minimum, so the carbon sweep cannot buy emissions cuts by dropping demand

The unmet-demand variable keeps every scenario feasible. In the baseline it is zero. The model is solved with PuLP 2.9 and HiGHS in process (CBC as a fallback). A full build (payoff table plus a 15-step sweep with a lexicographic social tie-break) takes about 12 seconds; the lab's 9-step front without the tie-break takes about 1 second.

## 6. Solution method

### 6.1 Payoff table

| Plan | Cost (USD M a year) | CO2e (kt a year) | Social score | Suppliers |
|---|---|---|---|---|
| Minimum cost | 4,645.8 | 4,045.0 | 0.478 | 15 |
| Minimum CO2e | 5,113.8 | 3,943.7 | 0.561 | 16 |
| Maximum social | 5,156.8 | 4,051.8 | 0.580 | 15 |

### 6.2 Epsilon-constraint front

Cost is minimised subject to Z2 <= epsilon for 15 values spaced evenly between the CO2e of the cheapest plan and the minimum CO2e. Each step is solved lexicographically (minimise cost, then maximise the social score with cost held at its optimum) to avoid weakly efficient points.

| Plan | Cost (USD M) | CO2e (kt) | Social | Suppliers | Mode split by tonnes |
|---|---|---|---|---|---|
| Cheapest | 4,645.7 | 4,045.0 | 0.472 | 15 | Sea 82%, diesel road 17%, rail 1% |
| Carbon-aware | 4,645.9 | 4,023.3 | 0.472 | 15 | Sea 82%, diesel road 17%, rail 1% |
| 7 | 4,646.7 | 4,001.6 | 0.494 | 15 | Sea 82%, diesel road 17%, rail 1% |
| 10 | 4,648.7 | 3,979.9 | 0.524 | 15 | Sea 78%, electric road 16%, rail 4% |
| Deep decarbonisation | 4,684.0 | 3,972.6 | 0.524 | 18 | Sea 76%, electric road 17%, rail 7% |
| 13 | 4,793.5 | 3,958.1 | 0.531 | 18 | Sea 75%, electric road 17%, rail 8% |
| Balanced (TOPSIS) | 4,914.4 | 3,950.9 | 0.541 | 16 | Sea 75%, electric road 17%, rail 8% |
| Lowest carbon | 5,113.7 | 3,943.7 | 0.561 | 16 | Sea 75%, electric road 17%, rail 8% |

### 6.3 Choosing a plan with TOPSIS

The efficient plans are ranked with TOPSIS on cost and CO2e (costs) and social score (benefit) with equal weights: vector normalisation, weighting, distance to the ideal and anti-ideal points, and relative closeness. The balanced plan has the highest closeness (0.673). The pick is not robust: plans 10 to 14 score between 0.654 and 0.673, so a small change in weights moves it along the flat part of the front. Before the forced-labour veto the pick was plan 11 (closeness 0.868); the veto widens the social range across the front, which pulls the pick towards the low-carbon end where JinkoSolar and Qcells are dropped.

Suppliers are ranked the same way within each product category (prices are not comparable across categories) on price, CO2e per tonne and transit days (costs) and social score (benefit), with default weights 0.3, 0.3, 0.1 and 0.3. The suite lets the user derive weights with AHP instead: six pairwise comparisons on Saaty's 1 to 9 scale, weights from the principal eigenvector, and a consistency ratio check that disables Apply above 0.10. Quality and lead time were dropped as criteria because no comparable public data exists.

## 7. Results

The balanced plan contracts 16 suppliers, costs 4,914 million USD a year and emits 3,951 kt CO2e. It ships 75 percent of tonnes by sea, 17 percent by electric truck and 8 percent by rail.

Main findings:

1. Products dominate, freight is small. In the cheapest plan PV modules account for 2,532 kt (63 percent) of CO2e, steel 875 kt, aluminium 348 kt, copper 132 kt and turbine components 25 kt. Freight is 137 kt (3.4 percent) even on well-to-wheel factors. Supplier choice matters far more than mode choice.
2. The front is narrow: 2.5 percent. The lowest-carbon plan emits only 101 kt less than the cheapest. The reason is a data limitation, not a property of the industry: five of six module makers use the same category footprint, and First Solar's value is a certification upper bound, so the model cannot tell module makers apart on carbon. Supplier-specific module footprints (EPDs) are the single most valuable missing data.
3. The first cuts are cheap. Moving short road legs to electric trucks and some sea freight to rail cuts 65 kt for 3 million USD, under 50 USD per tonne. The next 29 kt to the balanced plan cost 266 million USD (about 9,200 USD per tonne) because they need new suppliers; the last 7 kt to the lowest-carbon plan cost about 27,500 USD per tonne.
4. Steel is the cheapest lever. A carbon price of 100 USD per tonne moves 84 kt a year of steel from Tata Steel Nederland to SSAB and some aluminium from Ma'aden to Hydro, cutting 54 kt at 24 USD per tonne avoided.
5. The social pillar mostly moves with the environmental one, because the cleanest steel and aluminium makers (SSAB, Hydro) also score highest on the rubric. With the flag as a veto (section 2.4) the maximum-social plan buys nothing from JinkoSolar, LONGi or Trina. The cost and carbon plans still buy from LONGi, because social performance enters them only through TOPSIS weights: a score can make a supplier less attractive but never rules it out. Ruling it out is a constraint, not a weight. The lab's Forced-labour screen preset removes the three flagged makers: the cheapest plan then costs 231 million USD a year more (5.0 percent) and emits 19.5 kt less, because First Solar's thin-film modules replace part of the volume, and all demand is still met.

Pillar scores in the suite place the balanced plan between the extremes: economic 42.6 (100 is the cheapest plan), environmental 92.9 (100 is the lowest-carbon plan) and social 63.8. Because the front is only 2.5 percent wide in cost, a low economic score here still means a cost within 6 percent of the cheapest plan.

## 8. Scenario lab

The lab re-solves the model through a local endpoint (`POST /api/solve` in `run.py`). A scenario is plain JSON and every field enters the model directly:

| Lab control | Model effect |
|---|---|
| Supplier switched off | Supplier removed from I (outage, sanction, failed audit) |
| Mode switched off | Arcs of that mode removed |
| Demand by region (50 to 200 percent) | D_jk scaled for every project in the region |
| Carbon price (0 to 300 USD per t) | p Z2 added to the cost objective and reported separately |
| Red Sea closed | Sea arcs between Europe, the Americas and North Africa on one side and Asia and the Gulf on the other add 6,000 km (Cape of Good Hope) |
| Strait of Hormuz closed | Sea arcs to or from the UAE and Qatar removed |
| Plan under uncertainty | Adds the stochastic model of section 9 for the scenario |

The server checks every request (known supplier ids, modes and regions only; numbers in range; JSON content type; size limit) and serialises solves with one lock. Each answer contains the baseline and scenario fronts, the cheapest and balanced plans of each, their allocations, pillar scores on the baseline scale, and a "What changed" list built from the difference in supplier tonnages and mode shares. Where demand cannot be met the lab says so and does not report a cost per tonne avoided, because cost and CO2e are then not like for like.

The lab compares the cheapest plans by default. The balanced plan is re-picked by TOPSIS on each scenario's own front, so it can move along the front for reasons unrelated to the scenario; the cheapest plan responds only to the scenario.

| Scenario (cheapest plan) | Cost change | CO2e change | Unmet demand |
|---|---|---|---|
| Red Sea closed | +15.2 M USD | +38.0 kt | 0 |
| Carbon price 100 USD per t | +1.3 M USD | -53.8 kt | 0 |
| Forced-labour screen (Jinko, LONGi, Trina off) | +230.6 M USD | -19.5 kt | 0 |
| Gulf demand +30 percent | +477.6 M USD | +710.5 kt | 0 |
| Asian module makers off (Jinko, LONGi, Trina, Adani) | +345.8 M USD | -533.4 kt | 72.5 kt (Saudi and UAE solar) |
| Strait of Hormuz closed | -241.3 M USD | -1,036.9 kt | 143.1 kt (UAE projects) |
| No electric trucks | no change | +0.1 kt | 0 |

The last two rows show why the unmet flag matters: losing supply lowers cost and CO2e only because less is delivered.

## 9. Stochastic model

### 9.1 Formulation

A two-stage stochastic program with recourse, solved as its deterministic equivalent with HiGHS.

- First stage, before uncertainty is known: contract y_i and reserve capacity r_i (500 t <= r_i <= K_i y_i). Cost: F y_i plus a reservation fee of 5 percent of the price on r_i.
- Second stage, in each scenario s with probability p_s: shipments x_as and unmet demand u_jks. Shipments from i are limited to r_i, or to zero if i is out in s. Demand D_jk times the scenario's regional multiplier must be met or charged at P_k.
- Objective: first-stage cost plus the expected second-stage cost.

### 9.2 Scenarios

Twenty equally likely scenarios are sampled with seed 7: one lognormal demand multiplier per region (mean 1, sigma 0.15), each supplier out with probability 0.05, the Red Sea closed with probability 0.15 and the Strait of Hormuz closed with probability 0.05. The sample contains four Red Sea closures, no Hormuz closure and 24 supplier outages.

### 9.3 Results

| Measure | Value |
|---|---|
| Expected cost, stochastic (robust) plan | 5,216 M USD |
| Expected cost of the mean-demand plan in the same scenarios | 8,627 M USD |
| Value of the stochastic solution (VSS) | 3,411 M USD |
| Expected cost with perfect information | 5,131 M USD |
| Expected value of perfect information (EVPI) | 86 M USD |
| CVaR 90 percent, robust plan | 6,299 M USD |
| CVaR 90 percent, mean-demand plan | 17,273 M USD |

The robust plan contracts 19 suppliers with spare reserved capacity, against 15 for the plan made for average demand. The mean-demand plan reserves exactly what average demand needs, so every demand surge or outage becomes unmet demand at ten times the price: it leaves Akita-Noshiro short in 80 percent of scenarios and Lagoa dos Ventos in 75 percent, against 35 percent for the robust plan.

VSS is large because of the penalty. It should be read as the value of avoiding shortfalls under a stated lost-load cost, not as a forecast saving; with a lower penalty it shrinks. EVPI is small (1.6 percent of expected cost): better forecasts are worth far less than reserving flexible capacity.

## 10. Fleet routing exercise

Fleet routing is a small capacitated vehicle-routing and depot-selection exercise for teaching last-mile trade-offs. Each region (UAE, Benelux, Yangtze Delta) has two depots and five sites. A plan opens depots and gives each truck an ordered list of sites, subject to capacity (16 or 12 loads), electric range (250 km), a 10-hour shift and, in the low-emission mandate, at least half of the routes electric. Road distance is 1.3 times the great-circle distance.

The module enumerates every feasible plan exactly and scores them on cost, CO2e (section 3) and diesel truck-km in residential areas.

| Region | Feasible plans (Standard, Peak, Mandate) | Pareto plans |
|---|---|---|
| UAE | 304, 1,056, 216 | 7, 3, 5 |
| Benelux | 288, 612, 216 | 13, 2, 6 |
| Yangtze Delta | 34, 129, 14 | 3, 7, 1 |

Exact enumeration works only because each region has five sites. Site loads are illustrative daily truckloads.

## 11. Limitations and next steps

1. Thirteen of 21 suppliers use a category carbon value or an upper bound, including all six module makers. Product EPDs would widen and sharpen the front more than any modelling change.
2. Prices are category market prices, not quotes; capacity is an assumed 40 percent share of category demand, not disclosed plant capacity.
3. Spend-based turbine footprints cover the maker's own Scope 1 and 2 only.
4. Distances are great-circle with circuity factors and simple reachability rules. The Red Sea detour is a flat 6,000 km, and all US projects are treated as west of Suez.
5. The social score is a rubric of binary or banded indicators with a forced-labour veto; it measures disclosure as much as performance. The flag is company-level and dates from 2021, so it cannot tell a flagged maker's traced, compliant product lines from the rest; product-level traceability evidence would be the fair way to lift it.
6. The stochastic results depend on the 10 times lost-load penalty, the 5 percent reservation fee and 20 sampled scenarios. A larger sample and a sensitivity study on the penalty are the next steps.
7. The model is single-period: it plans an average year of a three-year build, without inventory or ramp-up.
8. The forecast page in the suite uses a seeded synthetic history; only the forecasting method is real.

## 12. Reproducing the results

Quick start: double-click the `Cairn` shortcut in the project folder (Windows) or run `./start.sh` (macOS, Linux). The shortcut opens the app in the browser; when the model or the report needs rebuilding, a small window shows the progress first. The local server runs in the background, answers the Scenario lab and stops about three minutes after the last app tab is closed. `python run.py --rebuild` forces a fresh solve; `python run.py --shortcut` recreates the shortcut.

Requirements: Python 3.10 or later with `pip install -r requirements.txt` (PuLP 2.9 and highspy), and Node.js 18 or later with `npm install` for the browser tests. Opening `index.html` directly works for everything except the Scenario lab, which needs the server.

- Rebuild the dataset: `python model/build_data.py` (add `--weather` to refresh port weather).
- Check the model: `python model/test_model.py` checks demand balance, capacity, minimum orders and contracted suppliers on every plan; front monotonicity and dominance; the well-to-wheel factors; every scenario option (carbon price, disabled suppliers and modes, demand scale, a whole category switched off); and that VSS and EVPI are non-negative.
- Check the lab: `python model/lab.py` checks request validation and two scenarios.
- Run everything: `npm test` runs the model check and the browser tests (Scenario lab and its API, routing, decision suite MCDM and AHP, methods tab, video player, demos, accessibility with axe-core, and a layout audit at desktop and phone widths in both themes).

## References

- Carrara S., Alves Dias P., Plazzotta B., Pavel C. (2020). Raw materials demand for wind and solar PV technologies in the transition towards a decarbonised energy system. JRC, EUR 30095 EN.
- Department for Energy Security and Net Zero (2024). Greenhouse gas reporting: conversion factors 2024, flat file v1.1.
- Ember (latest year). Carbon intensity of electricity generation by country, via Our World in Data.
- ICCT (2025). Real-world performance of battery electric tractor-trailers in European fleets.
- International Copper Association (2023). Copper Environmental Profile, Global.
- Yuan et al. (2024). Carbon footprint of China's PERC modules.
- Global Electronics Council (2024). EPEAT Climate+ criteria for PV modules; First Solar Series 6 Plus and Series 7.
- Murphy L., Elimae N. (2021). In Broad Daylight: Uyghur Forced Labour and Global Solar Supply Chains. Sheffield Hallam University.
- Regulation (EU) 2024/3015 of the European Parliament and of the Council of 27 November 2024 on prohibiting products made with forced labour on the Union market. Official Journal of the European Union.
- Uyghur Forced Labor Prevention Act, Public Law 117-78 (2021). United States Congress.
- World Bank (2025). Commodity Markets Outlook, annual prices 2024. OPIS Solar Weekly (2024). NREL (2025) Solar Industry Update. SteelOrbis HRC price history 2024. ECB euro reference rates 2024.
- Company reports, 2024 or latest: EGA, SSAB, EMSTEEL, Ma'aden, Norsk Hydro, Tata Steel Nederland, Prysmian, JinkoSolar, LONGi, Trina Solar, First Solar, Vestas, Siemens Energy, GE Vernova. Project capacities from developer and trade-press reports, listed per project in `model/inputs/hubs.json`.
- Birge J. R., Louveaux F. (2011). Introduction to Stochastic Programming, 2nd ed. Springer (VSS and EVPI).
- Rockafellar R. T., Uryasev S. (2000). Optimization of conditional value-at-risk. Journal of Risk, 2(3), 21-41.
- Haimes Y. Y., Lasdon L. S., Wismer D. A. (1971). On a bicriterion formulation of the problems of integrated system identification and system optimization. IEEE Transactions on Systems, Man, and Cybernetics, 1(3), 296-297.
- Mavrotas G. (2009). Effective implementation of the epsilon-constraint method in multi-objective mathematical programming problems. Applied Mathematics and Computation, 213(2), 455-465.
- Hwang C. L., Yoon K. (1981). Multiple Attribute Decision Making: Methods and Applications. Springer.
- Saaty T. L. (1980). The Analytic Hierarchy Process. McGraw-Hill.
- ISO 14083:2023. Greenhouse gases: quantification and reporting of greenhouse gas emissions arising from transport chain operations.
- Smart Freight Centre (2023). GLEC Framework for Logistics Emissions Accounting and Reporting, version 3.
