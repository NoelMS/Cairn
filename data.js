window.DASHBOARD_DATA = {
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
   "weather": "open-meteo readings at the last refresh (build_data.py --weather)."
  },
  "bibliography": {
   "S_JRC": "Carrara S., Alves Dias P., Plazzotta B., Pavel C. (2020). Raw materials demand for wind and solar PV technologies in the transition towards a decarbonised energy system. JRC, EUR 30095 EN, doi:10.2760/160859.",
   "S_DESNZ": "UK Department for Energy Security and Net Zero (2024). Greenhouse gas reporting: conversion factors 2024, flat file v1.1.",
   "S_WB": "World Bank (2025). Commodity Markets Outlook, historical data, annual prices (nominal), 2024.",
   "S_ECB": "European Central Bank. Euro foreign exchange reference rates, US dollar, 2024 annual average 1.0824.",
   "S_OPIS": "OPIS Solar Weekly (July 2024). Chinese Module Marker, TOPCon, FOB China, USD 0.100/W.",
   "S_NREL": "NREL (2025). Winter 2025 Solar Industry Update. Average US module price Q3 2024, USD 0.29/Wdc.",
   "S_STEELORBIS": "SteelOrbis. Hot rolled coil annual averages 2024: ex-China SS400 FOB USD 513.2/t; EU domestic ex-works EUR 641.68/t.",
   "S_VESTAS_FY24": "Vestas Wind Systems (5 Feb 2025). Full year 2024 investor presentation: ASP of order intake EUR 1.18m/MW in Q4 2024 (p.6); revenue EUR 17.3bn; Scope 1+2 0.105 Mt CO2e; TRIR 3.0.",
   "S_ICA": "International Copper Association (2023). Copper Environmental Profile, Global, Table 4: climate change 3,965 kg CO2e per tonne of copper cathode.",
   "S_YUAN": "Yuan et al. (2024). Carbon footprint of China's PERC modules: 412 kg CO2e/kWp (bifacial) and 517 (monofacial) with the national average grid.",
   "S_EPEAT": "Global Electronics Council / First Solar (4 Jun 2024). First Solar Series 6 Plus and Series 7 TR1 receive EPEAT Climate+ (threshold 400 kg CO2e/kWp or less).",
   "S_SHU": "Murphy L., Elimae N. (2021). In Broad Daylight: Uyghur Forced Labour and Global Solar Supply Chains. Sheffield Hallam University, Helena Kennedy Centre for International Justice.",
   "S_UNGC": "UN Global Compact participant directory (unglobalcompact.org), checked 18 Oct 2026.",
   "S_ICCT": "ICCT (2025). Real-world performance of battery electric tractor-trailers in European fleets: 0.92 to 1.50 kWh/km.",
   "S_EMBER": "Ember, carbon intensity of electricity generation by country, latest year, via Our World in Data energy dataset (owid-energy-data.csv).",
   "S_EGA24": "Emirates Global Aluminium (2025). 2024 Sustainability Report.",
   "S_SSAB24": "SSAB (2025). Annual Report 2024.",
   "S_EMSTEEL25": "EMSTEEL (2026). Sustainability Report 2025.",
   "S_MAADEN24": "Ma'aden (2025). Sustainability Report 2024.",
   "S_HYDRO24": "Norsk Hydro (2025). Integrated Annual Report 2024; ISO 45001:2018 certificate, Hydro Aluminium Metal.",
   "S_TATANL25": "Tata Steel Nederland (2025). Annual Report and Accounts 2024-2025.",
   "S_PRYSMIAN": "Prysmian. Health and Safety (2024 OSHA-based LTI frequency 1.07); end-2023 ISO 45001 certified plants 75%.",
   "S_JINKO": "JinkoSolar. ESG: production safety management (85.71% of operating bases ISO 45001 certified).",
   "S_LONGI": "LONGi 2024 Sustainability Report as reported by enerad.pl (all facilities ISO 45001 and ISO 37301 certified; secondary source).",
   "S_TRINA": "Trinasolar (2025). 2024 Sustainability Report press release (SA8000 certification).",
   "S_FSLR": "First Solar (2024). Sustainability Report 2024 (RBA Validated Assessment Program, Platinum).",
   "S_SIEMENS_E": "Siemens Energy (2024). Sustainability Report 2024, ESG performance: LTIFR 1.27 (group, FY2024).",
   "S_GEV": "GE Vernova (2025). 2024 Sustainability Performance Data: Scope 1+2 market-based 428,213 t CO2e; 2024 Form 10-K revenue USD 34.9bn.",
   "S_PROJECTS": "Project capacities from developer and trade-press reports listed per project."
  },
  "prices": {
   "modules_cn": {
    "usd_per_w": 0.1,
    "src": "S_OPIS"
   },
   "modules_us": {
    "usd_per_w": 0.29,
    "src": "S_NREL"
   },
   "steel_asia": {
    "usd_per_t": 513.2,
    "src": "S_STEELORBIS"
   },
   "steel_eu": {
    "usd_per_t": 694.55,
    "src": "S_STEELORBIS, S_ECB"
   },
   "aluminium": {
    "usd_per_t": 2419.02,
    "src": "S_WB"
   },
   "copper": {
    "usd_per_t": 9142.14,
    "src": "S_WB"
   },
   "turbine": {
    "usd_per_mw": 1277232,
    "src": "S_VESTAS_FY24, S_ECB"
   }
  },
  "material_t_per_mw": {
   "pv": {
    "modules": 59.0,
    "steel": 67.9,
    "aluminium": 7.5,
    "copper": 4.6,
    "note": "modules = glass 46.4 + plastic 8.6 + silicon 4.0 t/MW",
    "src": "S_JRC printed p.36"
   },
   "wind": {
    "turbine": 8.0,
    "steel": 119.5,
    "aluminium": 1.05,
    "copper": 2.1,
    "note": "turbine OEM scope proxied by blade composites 8 t/MW; steel and aluminium are range midpoints; copper is the median",
    "src": "S_JRC printed pp.21-22"
   }
  },
  "transport": {
   "ttw_kg_per_tkm": {
    "road_diesel": 0.09752,
    "rail": 0.02779,
    "sea_container": 0.01612
   },
   "wtt_kg_per_tkm": {
    "road_diesel": 0.02359,
    "rail": 0.00691,
    "sea_container": 0.00365
   },
   "rows": {
    "road_diesel": [
     "27_304_3140_14_1",
     "28_907_3140_14_1"
    ],
    "rail": [
     "27_315_3151_14_1",
     "28_911_3151_14_1"
    ],
    "sea_container": [
     "27_320_3235_14_1",
     "28_916_3235_14_1"
    ]
   },
   "hgv_per_km": {
    "ttw": 0.87296,
    "wtt": 0.21154,
    "rows": [
     "27_304_3140_4_1",
     "28_907_3140_4_1"
    ]
   },
   "electricity_uk": {
    "generation": 0.20705,
    "td_losses": 0.0183,
    "rows": [
     "30_400_4000_5_1",
     "13_402_4000_5_1"
    ]
   },
   "bev": {
    "kwh_per_km": 1.2,
    "kwh_src": "S_ICCT (midpoint of 0.92 to 1.50)",
    "payload_t": 8.95,
    "payload_note": "average HGV payload implied by DESNZ: 0.87296 kg/km over 0.09752 kg/tkm"
   },
   "src": "S_DESNZ"
  },
  "grid_g_per_kwh": {
   "UAE": 467.51,
   "Saudi Arabia": 691.95,
   "Qatar": 581.52,
   "Germany": 329.65,
   "Netherlands": 253.56,
   "Denmark": 114.41,
   "Spain": 153.6,
   "Sweden": 35.26,
   "Norway": 28.11,
   "China": 525.34,
   "India": 670.13,
   "South Korea": 417.06,
   "Japan": 477.26,
   "USA": 384.4,
   "Brazil": 109.95,
   "Chile": 289.49,
   "Egypt": 563.23,
   "Kenya": 95.44,
   "Morocco": 596.4,
   "Italy": 284.78,
   "France": 41.44,
   "UK": 217.41
  },
  "assumptions": {
   "road_circuity": 1.25,
   "rail_circuity": 1.25,
   "sea_circuity": 1.35,
   "drayage_km_each_end": 150,
   "bev_max_road_km": 600,
   "road_max_km": 3500,
   "rail_max_km": 5000,
   "cost_usd_per_tkm": {
    "road_diesel": 0.12,
    "road_bev": 0.13,
    "rail": 0.05,
    "sea_container": 0.015
   },
   "contract_fixed_usd": 250000,
   "min_order_t": 500,
   "unmet_penalty_multiple": 10,
   "suez_detour_km": 6000,
   "build_years": 3,
   "max_share_per_supplier": 0.4,
   "eur_usd_2024": 1.0824
  },
  "plan_weights": {
   "cost": 0.3333333333333333,
   "co2": 0.3333333333333333,
   "social": 0.3333333333333333
  },
  "payoff": {
   "min_cost": {
    "cost": 4645839537,
    "co2_t": 4045006.7,
    "social": 0.4776,
    "suppliers": [
     "SUP_ADANI",
     "SUP_DUCAB",
     "SUP_EGA",
     "SUP_ELSEWEDY",
     "SUP_EMSTEEL",
     "SUP_GEV",
     "SUP_HYDRO",
     "SUP_LONGI",
     "SUP_MAADEN",
     "SUP_NKT",
     "SUP_QCELLS",
     "SUP_SGRE",
     "SUP_SSAB",
     "SUP_TATA_NL",
     "SUP_VESTAS"
    ]
   },
   "min_co2": {
    "cost": 5113793444,
    "co2_t": 3943666.8,
    "social": 0.5613,
    "suppliers": [
     "SUP_ADANI",
     "SUP_DUCAB",
     "SUP_EGA",
     "SUP_ELSEWEDY",
     "SUP_EMSTEEL",
     "SUP_FIRST_SOLAR",
     "SUP_GOLDWIND",
     "SUP_HYDRO",
     "SUP_LONGI",
     "SUP_MAADEN",
     "SUP_NEXANS",
     "SUP_NKT",
     "SUP_SGRE",
     "SUP_SSAB",
     "SUP_TATA_NL",
     "SUP_VESTAS"
    ]
   },
   "max_social": {
    "cost": 5156815334,
    "co2_t": 4051805.5,
    "social": 0.5795,
    "suppliers": [
     "SUP_ADANI",
     "SUP_EGA",
     "SUP_ELSEWEDY",
     "SUP_EMSTEEL",
     "SUP_FIRST_SOLAR",
     "SUP_GOLDWIND",
     "SUP_HYDRO",
     "SUP_MAADEN",
     "SUP_NKT",
     "SUP_PRYSMIAN",
     "SUP_QCELLS",
     "SUP_SGRE",
     "SUP_SSAB",
     "SUP_TATA_NL",
     "SUP_VESTAS"
    ]
   }
  }
 },
 "regions": [
  "All",
  "UAE",
  "Middle East",
  "Europe",
  "Asia Pacific",
  "Americas",
  "Africa"
 ],
 "countries": [
  "Brazil",
  "China",
  "Denmark",
  "Egypt",
  "Germany",
  "India",
  "Italy",
  "Japan",
  "Kenya",
  "Morocco",
  "Netherlands",
  "Norway",
  "Qatar",
  "Saudi Arabia",
  "South Korea",
  "Spain",
  "Sweden",
  "UAE",
  "UK",
  "USA"
 ],
 "categories": [
  "PV modules",
  "Steel",
  "Aluminium",
  "Copper cable",
  "Wind turbine components"
 ],
 "suppliers": [
  {
   "id": "SUP_ADANI",
   "name": "Adani Solar (Adani Enterprises)",
   "category": "PV modules",
   "category_key": "modules",
   "location": "Mundra, Gujarat",
   "country": "India",
   "region": "Asia Pacific",
   "lat": 22.84,
   "lon": 69.72,
   "cost_per_unit": 1694.9,
   "co2_per_unit": 6.983,
   "transit_days": 10.9,
   "social_score": 0.2,
   "capacity": 145014,
   "certifications": [],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value applied (no product footprint found for Adani Solar)",
   "carbon_source": "S_YUAN",
   "social_source": "none found in this review; Adani Enterprises not in S_UNGC",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 0,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "none found in this review; Adani Enterprises not in S_UNGC"
   },
   "note": "China FOB price used as the regional module price",
   "topsis_score": 62.0,
   "rank": 1
  },
  {
   "id": "SUP_QCELLS",
   "name": "Hanwha Qcells",
   "category": "PV modules",
   "category_key": "modules",
   "location": "Jincheon",
   "country": "South Korea",
   "region": "Asia Pacific",
   "lat": 36.86,
   "lon": 127.44,
   "cost_per_unit": 1694.9,
   "co2_per_unit": 6.983,
   "transit_days": 19.7,
   "social_score": 0.2,
   "capacity": 145014,
   "certifications": [],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value applied (no product footprint found for Qcells)",
   "carbon_source": "S_YUAN",
   "social_source": "none found in this review",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 0,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "none found in this review"
   },
   "note": "Korean plant; China FOB price used as the regional module price",
   "topsis_score": 61.5,
   "rank": 2
  },
  {
   "id": "SUP_FIRST_SOLAR",
   "name": "First Solar",
   "category": "PV modules",
   "category_key": "modules",
   "location": "Perrysburg, Ohio",
   "country": "USA",
   "region": "Americas",
   "lat": 41.55,
   "lon": -83.63,
   "cost_per_unit": 4915.3,
   "co2_per_unit": 6.78,
   "transit_days": 24.3,
   "social_score": 0.4,
   "capacity": 145014,
   "certifications": [
    "Independent social audit or rating"
   ],
   "esg_tier": "Company-specific carbon data",
   "carbon_basis": "upper bound: EPEAT Climate+ certified (400 kg CO2e/kWp or less)",
   "carbon_source": "S_EPEAT",
   "social_source": "S_FSLR (RBA VAP Platinum); not in S_UNGC",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 0,
    "injury": null,
    "audit": 1,
    "forced_labour_flag": 0,
    "src": "S_FSLR (RBA VAP Platinum); not in S_UNGC"
   },
   "note": null,
   "topsis_score": 60.7,
   "rank": 3
  },
  {
   "id": "SUP_JINKO",
   "name": "JinkoSolar",
   "category": "PV modules",
   "category_key": "modules",
   "location": "Shangrao, Jiangxi",
   "country": "China",
   "region": "Asia Pacific",
   "lat": 28.45,
   "lon": 117.94,
   "cost_per_unit": 1694.9,
   "co2_per_unit": 6.983,
   "transit_days": 18.9,
   "social_score": 0.0,
   "capacity": 145014,
   "certifications": [
    "ISO 45001 (part of sites)",
    "UN Global Compact",
    "Named in forced-labour supply-chain research (2021)"
   ],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value: c-Si module made on the Chinese average grid (bifacial PERC)",
   "carbon_source": "S_YUAN",
   "social_source": "S_JINKO; S_UNGC (joined 2021); S_SHU",
   "social_indicators": {
    "iso45001": 0.5,
    "ungc": 1,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 1,
    "src": "S_JINKO; S_UNGC (joined 2021); S_SHU"
   },
   "note": null,
   "topsis_score": 38.9,
   "rank": 4
  },
  {
   "id": "SUP_LONGI",
   "name": "LONGi Green Energy",
   "category": "PV modules",
   "category_key": "modules",
   "location": "Xi'an, Shaanxi",
   "country": "China",
   "region": "Asia Pacific",
   "lat": 34.34,
   "lon": 108.94,
   "cost_per_unit": 1694.9,
   "co2_per_unit": 6.983,
   "transit_days": 17.0,
   "social_score": 0.0,
   "capacity": 145014,
   "certifications": [
    "ISO 45001",
    "UN Global Compact",
    "Named in forced-labour supply-chain research (2021)"
   ],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value: c-Si module made on the Chinese average grid (bifacial PERC)",
   "carbon_source": "S_YUAN",
   "social_source": "S_LONGI (secondary); S_UNGC (joined 2019); S_SHU",
   "social_indicators": {
    "iso45001": 1,
    "ungc": 1,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 1,
    "src": "S_LONGI (secondary); S_UNGC (joined 2019); S_SHU"
   },
   "note": null,
   "topsis_score": 38.9,
   "rank": 5
  },
  {
   "id": "SUP_TRINA",
   "name": "Trina Solar",
   "category": "PV modules",
   "category_key": "modules",
   "location": "Changzhou, Jiangsu",
   "country": "China",
   "region": "Asia Pacific",
   "lat": 31.81,
   "lon": 119.97,
   "cost_per_unit": 1694.9,
   "co2_per_unit": 6.983,
   "transit_days": 18.9,
   "social_score": 0.0,
   "capacity": 145014,
   "certifications": [
    "UN Global Compact",
    "Independent social audit or rating",
    "Named in forced-labour supply-chain research (2021)"
   ],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value: c-Si module made on the Chinese average grid (bifacial PERC)",
   "carbon_source": "S_YUAN",
   "social_source": "S_TRINA (SA8000); S_UNGC (joined 2024); S_SHU",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 1,
    "injury": null,
    "audit": 1,
    "forced_labour_flag": 1,
    "src": "S_TRINA (SA8000); S_UNGC (joined 2024); S_SHU"
   },
   "note": null,
   "topsis_score": 38.9,
   "rank": 6
  },
  {
   "id": "SUP_EMSTEEL",
   "name": "EMSTEEL",
   "category": "Steel",
   "category_key": "steel",
   "location": "Mussafah, Abu Dhabi",
   "country": "UAE",
   "region": "UAE",
   "lat": 24.35,
   "lon": 54.5,
   "cost_per_unit": 513.2,
   "co2_per_unit": 0.637,
   "transit_days": 11.5,
   "social_score": 0.6,
   "capacity": 281227,
   "certifications": [
    "ISO 45001"
   ],
   "esg_tier": "Company-specific carbon data",
   "carbon_basis": "Scope 1+2 intensity of steel production, 2025 (DRI-EAF)",
   "carbon_source": "S_EMSTEEL25 p.19",
   "social_source": "S_EMSTEEL25 pp.29, 37; not in S_UNGC",
   "social_indicators": {
    "iso45001": 1,
    "ungc": 0,
    "injury": {
     "type": "LTIFR",
     "value": 0.0
    },
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_EMSTEEL25 pp.29, 37; not in S_UNGC"
   },
   "note": "Asian export HRC price used as the Gulf price",
   "topsis_score": 63.4,
   "rank": 1
  },
  {
   "id": "SUP_SSAB",
   "name": "SSAB",
   "category": "Steel",
   "category_key": "steel",
   "location": "Lulea",
   "country": "Sweden",
   "region": "Europe",
   "lat": 65.58,
   "lon": 22.15,
   "cost_per_unit": 694.5,
   "co2_per_unit": 1.462,
   "transit_days": 13.0,
   "social_score": 0.96,
   "capacity": 281227,
   "certifications": [
    "ISO 45001",
    "UN Global Compact",
    "Independent social audit or rating"
   ],
   "esg_tier": "Company-specific carbon data",
   "carbon_basis": "(Scope 1 9,483 kt + Scope 2 1,260 kt) / crude steel 7,349 kt, 2024",
   "carbon_source": "S_SSAB24 p.68",
   "social_source": "S_SSAB24 pp.8-9 (UNGC, LTIF 0.75, EcoVadis gold), S1 (ISO 45001 all sites)",
   "social_indicators": {
    "iso45001": 1,
    "ungc": 1,
    "injury": {
     "type": "LTIF",
     "value": 0.75
    },
    "audit": 1,
    "forced_labour_flag": 0,
    "src": "S_SSAB24 pp.8-9 (UNGC, LTIF 0.75, EcoVadis gold), S1 (ISO 45001 all sites)"
   },
   "note": null,
   "topsis_score": 49.1,
   "rank": 2
  },
  {
   "id": "SUP_TATA_NL",
   "name": "Tata Steel Nederland",
   "category": "Steel",
   "category_key": "steel",
   "location": "IJmuiden",
   "country": "Netherlands",
   "region": "Europe",
   "lat": 52.47,
   "lon": 4.6,
   "cost_per_unit": 694.5,
   "co2_per_unit": 1.743,
   "transit_days": 12.0,
   "social_score": 0.52,
   "capacity": 281227,
   "certifications": [
    "ISO 45001 (part of sites)",
    "UN Global Compact (parent)"
   ],
   "esg_tier": "Company-specific carbon data",
   "carbon_basis": "Scope 1 baseline 12.6 Mt CO2 at 7.23 Mt crude steel capacity (Scope 1 only)",
   "carbon_source": "S_TATANL25 p.27",
   "social_source": "S_TATANL25 pp.46-47 (18 of 22 sites ISO 45001; LTIF 1.43); parent Tata Steel in S_UNGC",
   "social_indicators": {
    "iso45001": 0.5,
    "ungc": 0.5,
    "injury": {
     "type": "LTIF",
     "value": 1.43
    },
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_TATANL25 pp.46-47 (18 of 22 sites ISO 45001; LTIF 1.43); parent Tata Steel in S_UNGC"
   },
   "note": null,
   "topsis_score": 2.5,
   "rank": 3
  },
  {
   "id": "SUP_HYDRO",
   "name": "Norsk Hydro",
   "category": "Aluminium",
   "category_key": "aluminium",
   "location": "Sunndalsora",
   "country": "Norway",
   "region": "Europe",
   "lat": 62.68,
   "lon": 8.55,
   "cost_per_unit": 2419.0,
   "co2_per_unit": 4.0,
   "transit_days": 14.3,
   "social_score": 0.72,
   "capacity": 19439,
   "certifications": [
    "ISO 45001",
    "UN Global Compact"
   ],
   "esg_tier": "Company-specific carbon data",
   "carbon_basis": "certified footprint of Hydro primary aluminium, below 4 kg CO2e/kg (upper bound)",
   "carbon_source": "S_HYDRO24 p.16",
   "social_source": "S_HYDRO24 p.5 (TRI 2.0), ISO 45001 certificate; S_UNGC (joined 2000)",
   "social_indicators": {
    "iso45001": 1,
    "ungc": 1,
    "injury": {
     "type": "TRI",
     "value": 2.0
    },
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_HYDRO24 p.5 (TRI 2.0), ISO 45001 certificate; S_UNGC (joined 2000)"
   },
   "note": null,
   "topsis_score": 79.2,
   "rank": 1
  },
  {
   "id": "SUP_EGA",
   "name": "Emirates Global Aluminium",
   "category": "Aluminium",
   "category_key": "aluminium",
   "location": "Jebel Ali, Dubai",
   "country": "UAE",
   "region": "UAE",
   "lat": 25.01,
   "lon": 55.08,
   "cost_per_unit": 2419.0,
   "co2_per_unit": 7.57,
   "transit_days": 9.0,
   "social_score": 0.8,
   "capacity": 19439,
   "certifications": [
    "ISO 45001",
    "Independent social audit or rating"
   ],
   "esg_tier": "Company-specific carbon data",
   "carbon_basis": "Scope 1+2 GHG intensity of UAE metal, 2024",
   "carbon_source": "S_EGA24 (GHG emissions: smelting)",
   "social_source": "S_EGA24 (ISO 45001:2018, UAE LTIFR 0.05, ASI Performance Standard); not in S_UNGC",
   "social_indicators": {
    "iso45001": 1,
    "ungc": 0,
    "injury": {
     "type": "LTIFR",
     "value": 0.05
    },
    "audit": 1,
    "forced_labour_flag": 0,
    "src": "S_EGA24 (ISO 45001:2018, UAE LTIFR 0.05, ASI Performance Standard); not in S_UNGC"
   },
   "note": null,
   "topsis_score": 39.3,
   "rank": 2
  },
  {
   "id": "SUP_MAADEN",
   "name": "Ma'aden Aluminium",
   "category": "Aluminium",
   "category_key": "aluminium",
   "location": "Ras Al Khair",
   "country": "Saudi Arabia",
   "region": "Middle East",
   "lat": 27.53,
   "lon": 49.23,
   "cost_per_unit": 2419.0,
   "co2_per_unit": 9.41,
   "transit_days": 8.9,
   "social_score": 0.8,
   "capacity": 19439,
   "certifications": [
    "ISO 45001",
    "UN Global Compact",
    "Independent social audit or rating"
   ],
   "esg_tier": "Company-specific carbon data",
   "carbon_basis": "smelter GHG intensity, liquid aluminium, 2024 (ASI 5.2A)",
   "carbon_source": "S_MAADEN24 p.64",
   "social_source": "S_MAADEN24 p.24 (ISO 45001), ASI certified; S_UNGC (joined 2023)",
   "social_indicators": {
    "iso45001": 1,
    "ungc": 1,
    "injury": null,
    "audit": 1,
    "forced_labour_flag": 0,
    "src": "S_MAADEN24 p.24 (ISO 45001), ASI certified; S_UNGC (joined 2023)"
   },
   "note": null,
   "topsis_score": 20.8,
   "rank": 3
  },
  {
   "id": "SUP_PRYSMIAN",
   "name": "Prysmian",
   "category": "Copper cable",
   "category_key": "copper",
   "location": "Pignataro Maggiore",
   "country": "Italy",
   "region": "Europe",
   "lat": 41.19,
   "lon": 14.17,
   "cost_per_unit": 9142.1,
   "co2_per_unit": 3.965,
   "transit_days": 12.1,
   "social_score": 0.62,
   "capacity": 13315,
   "certifications": [
    "ISO 45001 (part of sites)",
    "UN Global Compact"
   ],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value: global copper cathode cradle-to-gate (cable processing not included)",
   "carbon_source": "S_ICA",
   "social_source": "S_PRYSMIAN; S_UNGC (joined 2021)",
   "social_indicators": {
    "iso45001": 0.5,
    "ungc": 1,
    "injury": {
     "type": "LTIF",
     "value": 1.07
    },
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_PRYSMIAN; S_UNGC (joined 2021)"
   },
   "note": null,
   "topsis_score": 93.9,
   "rank": 1
  },
  {
   "id": "SUP_ELSEWEDY",
   "name": "Elsewedy Electric",
   "category": "Copper cable",
   "category_key": "copper",
   "location": "10th of Ramadan City",
   "country": "Egypt",
   "region": "Africa",
   "lat": 30.29,
   "lon": 31.75,
   "cost_per_unit": 9142.1,
   "co2_per_unit": 3.965,
   "transit_days": 10.1,
   "social_score": 0.4,
   "capacity": 13315,
   "certifications": [
    "UN Global Compact"
   ],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value: global copper cathode cradle-to-gate (cable processing not included)",
   "carbon_source": "S_ICA",
   "social_source": "S_UNGC (joined 2018); ISO 45001 claim found only for 2020",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 1,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_UNGC (joined 2018); ISO 45001 claim found only for 2020"
   },
   "note": null,
   "topsis_score": 48.5,
   "rank": 2
  },
  {
   "id": "SUP_NKT",
   "name": "NKT",
   "category": "Copper cable",
   "category_key": "copper",
   "location": "Karlskrona",
   "country": "Sweden",
   "region": "Europe",
   "lat": 56.16,
   "lon": 15.59,
   "cost_per_unit": 9142.1,
   "co2_per_unit": 3.965,
   "transit_days": 12.8,
   "social_score": 0.4,
   "capacity": 13315,
   "certifications": [
    "UN Global Compact"
   ],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value: global copper cathode cradle-to-gate (cable processing not included)",
   "carbon_source": "S_ICA",
   "social_source": "S_UNGC (joined 2009)",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 1,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_UNGC (joined 2009)"
   },
   "note": null,
   "topsis_score": 47.5,
   "rank": 3
  },
  {
   "id": "SUP_NEXANS",
   "name": "Nexans Maroc",
   "category": "Copper cable",
   "category_key": "copper",
   "location": "Mohammedia",
   "country": "Morocco",
   "region": "Africa",
   "lat": 33.69,
   "lon": -7.39,
   "cost_per_unit": 9142.1,
   "co2_per_unit": 3.965,
   "transit_days": 14.8,
   "social_score": 0.3,
   "capacity": 13315,
   "certifications": [
    "UN Global Compact (parent)"
   ],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value: global copper cathode cradle-to-gate (cable processing not included)",
   "carbon_source": "S_ICA",
   "social_source": "parent Nexans in S_UNGC (joined 2008)",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 0.5,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "parent Nexans in S_UNGC (joined 2008)"
   },
   "note": "Moroccan subsidiary; social indicators of the Nexans group",
   "topsis_score": 23.5,
   "rank": 4
  },
  {
   "id": "SUP_DUCAB",
   "name": "Ducab",
   "category": "Copper cable",
   "category_key": "copper",
   "location": "Jebel Ali, Dubai",
   "country": "UAE",
   "region": "UAE",
   "lat": 24.98,
   "lon": 55.1,
   "cost_per_unit": 9142.1,
   "co2_per_unit": 3.965,
   "transit_days": 9.7,
   "social_score": 0.2,
   "capacity": 13315,
   "certifications": [],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "category value: global copper cathode cradle-to-gate (cable processing not included)",
   "carbon_source": "S_ICA",
   "social_source": "none found in this review",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 0,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "none found in this review"
   },
   "note": null,
   "topsis_score": 12.1,
   "rank": 5
  },
  {
   "id": "SUP_VESTAS",
   "name": "Vestas",
   "category": "Wind turbine components",
   "category_key": "turbine",
   "location": "Aarhus",
   "country": "Denmark",
   "region": "Europe",
   "lat": 56.16,
   "lon": 10.2,
   "cost_per_unit": 159654.0,
   "co2_per_unit": 0.895,
   "transit_days": 9.7,
   "social_score": 0.48,
   "capacity": 7654,
   "certifications": [
    "UN Global Compact"
   ],
   "esg_tier": "Company-specific carbon data",
   "carbon_basis": "Scope 1+2 0.105 Mt / revenue EUR 17.3bn, 2024 (spend-based)",
   "carbon_source": "S_VESTAS_FY24",
   "social_source": "S_VESTAS_FY24 (TRIR 3.0); S_UNGC (joined 2009)",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 1,
    "injury": {
     "type": "TRI",
     "value": 3.0
    },
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_VESTAS_FY24 (TRIR 3.0); S_UNGC (joined 2009)"
   },
   "note": null,
   "topsis_score": 100.0,
   "rank": 1
  },
  {
   "id": "SUP_SGRE",
   "name": "Siemens Gamesa",
   "category": "Wind turbine components",
   "category_key": "turbine",
   "location": "Zamudio, Bilbao",
   "country": "Spain",
   "region": "Europe",
   "lat": 43.28,
   "lon": -2.87,
   "cost_per_unit": 159654.0,
   "co2_per_unit": 1.427,
   "transit_days": 10.2,
   "social_score": 0.42,
   "capacity": 7654,
   "certifications": [
    "UN Global Compact (parent)"
   ],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "not disclosed separately; category median used",
   "carbon_source": "S_SIEMENS_E",
   "social_source": "S_SIEMENS_E (parent group LTIFR 1.27); parent Siemens Energy in S_UNGC",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 0.5,
    "injury": {
     "type": "LTIFR",
     "value": 1.27
    },
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_SIEMENS_E (parent group LTIFR 1.27); parent Siemens Energy in S_UNGC"
   },
   "note": null,
   "topsis_score": 53.0,
   "rank": 2
  },
  {
   "id": "SUP_GOLDWIND",
   "name": "Goldwind",
   "category": "Wind turbine components",
   "category_key": "turbine",
   "location": "Beijing",
   "country": "China",
   "region": "Asia Pacific",
   "lat": 39.9,
   "lon": 116.4,
   "cost_per_unit": 159654.0,
   "co2_per_unit": 1.427,
   "transit_days": 22.1,
   "social_score": 0.4,
   "capacity": 7654,
   "certifications": [
    "UN Global Compact"
   ],
   "esg_tier": "Category average carbon data",
   "carbon_basis": "reports operational carbon neutrality without usable absolute figures; category median used",
   "carbon_source": "Goldwind 2024 Sustainability Report",
   "social_source": "S_UNGC (joined 2021)",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 1,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_UNGC (joined 2021)"
   },
   "note": null,
   "topsis_score": 43.0,
   "rank": 3
  },
  {
   "id": "SUP_GEV",
   "name": "GE Vernova",
   "category": "Wind turbine components",
   "category_key": "turbine",
   "location": "Pensacola, Florida",
   "country": "USA",
   "region": "Americas",
   "lat": 30.45,
   "lon": -87.22,
   "cost_per_unit": 159654.0,
   "co2_per_unit": 1.959,
   "transit_days": 19.7,
   "social_score": 0.4,
   "capacity": 7654,
   "certifications": [
    "UN Global Compact"
   ],
   "esg_tier": "Company-specific carbon data",
   "carbon_basis": "Scope 1+2 market-based 428,213 t / revenue USD 34.9bn, 2024 (spend-based)",
   "carbon_source": "S_GEV",
   "social_source": "S_UNGC (joined 2024)",
   "social_indicators": {
    "iso45001": 0,
    "ungc": 1,
    "injury": null,
    "audit": 0,
    "forced_labour_flag": 0,
    "src": "S_UNGC (joined 2024)"
   },
   "note": null,
   "topsis_score": 5.9,
   "rank": 4
  }
 ],
 "demand_hubs": [
  {
   "id": "DEM_MBR6",
   "name": "MBR Solar Park Phase 6",
   "location_name": "UAE",
   "country": "UAE",
   "region": "UAE",
   "lat": 24.75,
   "lon": 55.37,
   "demand_annual_mw": 1800,
   "demand_units": 83400,
   "demand_t": {
    "PV modules": 35400,
    "Steel": 40740,
    "Aluminium": 4500,
    "Copper cable": 2760
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 1800
   },
   "priority": 1,
   "source": "Masdar project page; MEED (1,800 MW, Saih Al-Dahal)"
  },
  {
   "id": "DEM_DHAFRA",
   "name": "Al Dhafra Solar PV",
   "location_name": "UAE",
   "country": "UAE",
   "region": "UAE",
   "lat": 24.12,
   "lon": 54.55,
   "demand_annual_mw": 2000,
   "demand_units": 92667,
   "demand_t": {
    "PV modules": 39333,
    "Steel": 45267,
    "Aluminium": 5000,
    "Copper cable": 3067
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 2000
   },
   "priority": 1,
   "source": "NS Energy, Nov 2023 (2 GW)"
  },
  {
   "id": "DEM_NOOR_AD",
   "name": "Noor Abu Dhabi",
   "location_name": "UAE",
   "country": "UAE",
   "region": "UAE",
   "lat": 24.47,
   "lon": 55.34,
   "demand_annual_mw": 1177,
   "demand_units": 54534,
   "demand_t": {
    "PV modules": 23148,
    "Steel": 26639,
    "Aluminium": 2942,
    "Copper cable": 1805
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 1177
   },
   "priority": 1,
   "source": "Guinness World Records (1,177 MW)"
  },
  {
   "id": "DEM_KHAZNA",
   "name": "Khazna Solar PV",
   "location_name": "UAE",
   "country": "UAE",
   "region": "UAE",
   "lat": 24.2,
   "lon": 55.1,
   "demand_annual_mw": 1500,
   "demand_units": 69500,
   "demand_t": {
    "PV modules": 29500,
    "Steel": 33950,
    "Aluminium": 3750,
    "Copper cable": 2300
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 1500
   },
   "priority": 1,
   "source": "WAM (1.5 GW AC)"
  },
  {
   "id": "DEM_SUDAIR",
   "name": "Sudair Solar PV",
   "location_name": "Saudi Arabia",
   "country": "Saudi Arabia",
   "region": "Middle East",
   "lat": 25.45,
   "lon": 45.6,
   "demand_annual_mw": 1500,
   "demand_units": 69500,
   "demand_t": {
    "PV modules": 29500,
    "Steel": 33950,
    "Aluminium": 3750,
    "Copper cable": 2300
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 1500
   },
   "priority": 1,
   "source": "Argaam, Gulf Construction Online (1,500 MW)"
  },
  {
   "id": "DEM_KHARSAAH",
   "name": "Al Kharsaah Solar PV",
   "location_name": "Qatar",
   "country": "Qatar",
   "region": "Middle East",
   "lat": 25.24,
   "lon": 51.06,
   "demand_annual_mw": 800,
   "demand_units": 37067,
   "demand_t": {
    "PV modules": 15733,
    "Steel": 18107,
    "Aluminium": 2000,
    "Copper cable": 1227
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 800
   },
   "priority": 2,
   "source": "Enerdata (800 MW)"
  },
  {
   "id": "DEM_NEOM",
   "name": "NEOM Green Hydrogen renewables",
   "location_name": "Saudi Arabia",
   "country": "Saudi Arabia",
   "region": "Middle East",
   "lat": 27.95,
   "lon": 35.3,
   "demand_annual_mw": 3800,
   "demand_units": 171613,
   "demand_t": {
    "PV modules": 43267,
    "Steel": 113527,
    "Aluminium": 6060,
    "Copper cable": 4493,
    "Wind turbine components": 4267
   },
   "project_type": "Solar PV + Wind",
   "capacity_mw": {
    "pv": 2200,
    "wind": 1600
   },
   "priority": 1,
   "source": "Waterstofnet (2.2 GW solar, 1.6 GW wind; secondary)"
  },
  {
   "id": "DEM_REDSEA",
   "name": "Red Sea destination solar",
   "location_name": "Saudi Arabia",
   "country": "Saudi Arabia",
   "region": "Middle East",
   "lat": 25.6,
   "lon": 36.95,
   "demand_annual_mw": 340,
   "demand_units": 15753,
   "demand_t": {
    "PV modules": 6687,
    "Steel": 7695,
    "Aluminium": 850,
    "Copper cable": 521
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 340
   },
   "priority": 2,
   "source": "PV Tech (340 MWac)"
  },
  {
   "id": "DEM_WITZNITZ",
   "name": "Witznitz Energy Park",
   "location_name": "Germany",
   "country": "Germany",
   "region": "Europe",
   "lat": 51.15,
   "lon": 12.4,
   "demand_annual_mw": 605,
   "demand_units": 28032,
   "demand_t": {
    "PV modules": 11898,
    "Steel": 13693,
    "Aluminium": 1512,
    "Copper cable": 928
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 605
   },
   "priority": 2,
   "source": "TaiyangNews (605 MW)"
  },
  {
   "id": "DEM_NUNEZ",
   "name": "Nunez de Balboa PV",
   "location_name": "Spain",
   "country": "Spain",
   "region": "Europe",
   "lat": 38.39,
   "lon": -6.1,
   "demand_annual_mw": 500,
   "demand_units": 23167,
   "demand_t": {
    "PV modules": 9833,
    "Steel": 11317,
    "Aluminium": 1250,
    "Copper cable": 767
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 500
   },
   "priority": 2,
   "source": "Iberdrola (500 MWp)"
  },
  {
   "id": "DEM_DOGGER",
   "name": "Dogger Bank Wind Farm",
   "location_name": "UK",
   "country": "UK",
   "region": "Europe",
   "lat": 54.8,
   "lon": 1.9,
   "demand_annual_mw": 3600,
   "demand_units": 156780,
   "demand_t": {
    "Steel": 143400,
    "Aluminium": 1260,
    "Copper cable": 2520,
    "Wind turbine components": 9600
   },
   "project_type": "Wind",
   "capacity_mw": {
    "wind": 3600
   },
   "priority": 1,
   "source": "Equinor / Hydro International (3 x 1.2 GW)"
  },
  {
   "id": "DEM_BHADLA",
   "name": "Bhadla Solar Park",
   "location_name": "India",
   "country": "India",
   "region": "Asia Pacific",
   "lat": 27.53,
   "lon": 71.91,
   "demand_annual_mw": 2245,
   "demand_units": 104018,
   "demand_t": {
    "PV modules": 44152,
    "Steel": 50812,
    "Aluminium": 5612,
    "Copper cable": 3442
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 2245
   },
   "priority": 1,
   "source": "Bhadla Solar Park (2,245 MW)"
  },
  {
   "id": "DEM_AKITA",
   "name": "Akita and Noshiro offshore wind",
   "location_name": "Japan",
   "country": "Japan",
   "region": "Asia Pacific",
   "lat": 40.0,
   "lon": 140.0,
   "demand_annual_mw": 140,
   "demand_units": 6097,
   "demand_t": {
    "Steel": 5577,
    "Aluminium": 49,
    "Copper cable": 98,
    "Wind turbine components": 373
   },
   "project_type": "Wind",
   "capacity_mw": {
    "wind": 140
   },
   "priority": 2,
   "source": "Maritime Executive (33 x 4.2 MW)"
  },
  {
   "id": "DEM_EDWARDS",
   "name": "Edwards and Sanborn Solar",
   "location_name": "USA",
   "country": "USA",
   "region": "Americas",
   "lat": 35.0,
   "lon": -118.0,
   "demand_annual_mw": 807,
   "demand_units": 37391,
   "demand_t": {
    "PV modules": 15871,
    "Steel": 18265,
    "Aluminium": 2018,
    "Copper cable": 1237
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 807
   },
   "priority": 2,
   "source": "Terra-Gen (807 MW solar)"
  },
  {
   "id": "DEM_SAMSON",
   "name": "Samson Solar Energy Center",
   "location_name": "USA",
   "country": "USA",
   "region": "Americas",
   "lat": 33.66,
   "lon": -95.6,
   "demand_annual_mw": 1310,
   "demand_units": 60697,
   "demand_t": {
    "PV modules": 25763,
    "Steel": 29650,
    "Aluminium": 3275,
    "Copper cable": 2009
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 1310
   },
   "priority": 1,
   "source": "IPP Journal (1,310 MW)"
  },
  {
   "id": "DEM_EMPIRE",
   "name": "Empire Wind 1",
   "location_name": "USA",
   "country": "USA",
   "region": "Americas",
   "lat": 40.3,
   "lon": -73.4,
   "demand_annual_mw": 810,
   "demand_units": 35276,
   "demand_t": {
    "Steel": 32265,
    "Aluminium": 284,
    "Copper cable": 567,
    "Wind turbine components": 2160
   },
   "project_type": "Wind",
   "capacity_mw": {
    "wind": 810
   },
   "priority": 2,
   "source": "NYSERDA contract (810 MW)"
  },
  {
   "id": "DEM_LAGOA",
   "name": "Lagoa dos Ventos I and II",
   "location_name": "Brazil",
   "country": "Brazil",
   "region": "Americas",
   "lat": -8.48,
   "lon": -41.53,
   "demand_annual_mw": 716,
   "demand_units": 31182,
   "demand_t": {
    "Steel": 28521,
    "Aluminium": 251,
    "Copper cable": 501,
    "Wind turbine components": 1909
   },
   "project_type": "Wind",
   "capacity_mw": {
    "wind": 716
   },
   "priority": 2,
   "source": "Enerdata (716 MW)"
  },
  {
   "id": "DEM_BENBAN",
   "name": "Benban Solar Park",
   "location_name": "Egypt",
   "country": "Egypt",
   "region": "Africa",
   "lat": 24.45,
   "lon": 32.73,
   "demand_annual_mw": 1650,
   "demand_units": 76450,
   "demand_t": {
    "PV modules": 32450,
    "Steel": 37345,
    "Aluminium": 4125,
    "Copper cable": 2530
   },
   "project_type": "Solar PV",
   "capacity_mw": {
    "pv": 1650
   },
   "priority": 1,
   "source": "Benban Solar Park (1,650 MW nominal)"
  },
  {
   "id": "DEM_TURKANA",
   "name": "Lake Turkana Wind Power",
   "location_name": "Kenya",
   "country": "Kenya",
   "region": "Africa",
   "lat": 2.5,
   "lon": 36.8,
   "demand_annual_mw": 310,
   "demand_units": 13500,
   "demand_t": {
    "Steel": 12348,
    "Aluminium": 108,
    "Copper cable": 217,
    "Wind turbine components": 827
   },
   "project_type": "Wind",
   "capacity_mw": {
    "wind": 310
   },
   "priority": 2,
   "source": "Engineering News (310 MW)"
  }
 ],
 "telemetry": [
  {
   "port": "Jebel Ali Port",
   "country": "UAE",
   "region": "UAE",
   "hub_type": "Global Maritime Hub",
   "temperature_c": 31.4,
   "windspeed_kmh": 7.7,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 25.01,
   "lon": 55.06
  },
  {
   "port": "Hamriyah Maritime Port",
   "country": "UAE",
   "region": "UAE",
   "hub_type": "Regional Gateway",
   "temperature_c": 30.9,
   "windspeed_kmh": 3.4,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 25.47,
   "lon": 55.5
  },
  {
   "port": "Shanghai Port",
   "country": "China",
   "region": "Asia Pacific",
   "hub_type": "CleanTech Export Hub",
   "temperature_c": 22.1,
   "windspeed_kmh": 4.4,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 31.23,
   "lon": 121.47
  },
  {
   "port": "Port of Rotterdam",
   "country": "Netherlands",
   "region": "Europe",
   "hub_type": "European Green Corridor",
   "temperature_c": 15.9,
   "windspeed_kmh": 7.9,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 51.92,
   "lon": 4.48
  },
  {
   "port": "Port of Singapore",
   "country": "Singapore",
   "region": "Asia Pacific",
   "hub_type": "Transshipment Node",
   "temperature_c": 27,
   "windspeed_kmh": 9.9,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 1.29,
   "lon": 103.85
  },
  {
   "port": "Jeddah Islamic Port",
   "country": "Saudi Arabia",
   "region": "Middle East",
   "hub_type": "Red Sea Gateway",
   "temperature_c": 31.3,
   "windspeed_kmh": 2.2,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 21.48,
   "lon": 39.18
  },
  {
   "port": "Port of Hamburg",
   "country": "Germany",
   "region": "Europe",
   "hub_type": "Clean Hydrogen Terminal",
   "temperature_c": 14.2,
   "windspeed_kmh": 10.9,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 53.54,
   "lon": 9.99
  },
  {
   "port": "Jawaharlal Nehru Port",
   "country": "India",
   "region": "Asia Pacific",
   "hub_type": "South Asia Hub",
   "temperature_c": 25.9,
   "windspeed_kmh": 8,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 18.95,
   "lon": 72.95
  },
  {
   "port": "Port of Yokohama",
   "country": "Japan",
   "region": "Asia Pacific",
   "hub_type": "Pacific Energy Port",
   "temperature_c": 20.2,
   "windspeed_kmh": 11.2,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 35.44,
   "lon": 139.64
  },
  {
   "port": "Port of Houston",
   "country": "USA",
   "region": "Americas",
   "hub_type": "Americas Energy Port",
   "temperature_c": 33.6,
   "windspeed_kmh": 13.1,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 29.76,
   "lon": -95.36
  },
  {
   "port": "Port of Los Angeles",
   "country": "USA",
   "region": "Americas",
   "hub_type": "Pacific Gateway Port",
   "temperature_c": 22.4,
   "windspeed_kmh": 9.8,
   "delay_risk": "Medium",
   "status": "Operational - Moderate Congestion",
   "lat": 33.74,
   "lon": -118.26
  },
  {
   "port": "Port of Santos",
   "country": "Brazil",
   "region": "Americas",
   "hub_type": "South Atlantic Energy Terminal",
   "temperature_c": 26.8,
   "windspeed_kmh": 14.2,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": -23.95,
   "lon": -46.33
  },
  {
   "port": "Port of Valparaiso",
   "country": "Chile",
   "region": "Americas",
   "hub_type": "Pacific South America Terminal",
   "temperature_c": 17.3,
   "windspeed_kmh": 18.6,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": -33.04,
   "lon": -71.63
  },
  {
   "port": "Port of New York",
   "country": "USA",
   "region": "Americas",
   "hub_type": "North Atlantic Energy Hub",
   "temperature_c": 18.9,
   "windspeed_kmh": 11.4,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 40.64,
   "lon": -74.06
  },
  {
   "port": "Port of Mombasa",
   "country": "Kenya",
   "region": "Africa",
   "hub_type": "East Africa Green Energy Terminal",
   "temperature_c": 29.4,
   "windspeed_kmh": 16.1,
   "delay_risk": "Medium",
   "status": "Operational - Stable",
   "lat": -4.06,
   "lon": 39.66
  },
  {
   "port": "Port of Casablanca",
   "country": "Morocco",
   "region": "Africa",
   "hub_type": "North Africa Atlantic Terminal",
   "temperature_c": 21.7,
   "windspeed_kmh": 13.8,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 33.59,
   "lon": -7.59
  },
  {
   "port": "Port of Vancouver",
   "country": "Canada",
   "region": "Americas",
   "hub_type": "Pacific Northwest Gateway",
   "temperature_c": 16.5,
   "windspeed_kmh": 12,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": 49.28,
   "lon": -123.12
  },
  {
   "port": "Port of Colon",
   "country": "Panama",
   "region": "Americas",
   "hub_type": "Panama Canal Transit Hub",
   "temperature_c": 28.5,
   "windspeed_kmh": 15.2,
   "delay_risk": "Medium",
   "status": "Operational - Moderate Congestion",
   "lat": 9.35,
   "lon": -79.9
  },
  {
   "port": "Port of Buenos Aires",
   "country": "Argentina",
   "region": "Americas",
   "hub_type": "South Atlantic Shipping Port",
   "temperature_c": 19.8,
   "windspeed_kmh": 14.5,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": -34.6,
   "lon": -58.38
  },
  {
   "port": "Port of Callao",
   "country": "Peru",
   "region": "Americas",
   "hub_type": "Pacific South America Gateway",
   "temperature_c": 18.2,
   "windspeed_kmh": 11.8,
   "delay_risk": "Low",
   "status": "Operational - Optimal",
   "lat": -12.05,
   "lon": -77.15
  }
 ],
 "corridors": [
  {
   "source": "SUP_SSAB",
   "target": "DEM_NEOM",
   "corridor": "Lulea to NEOM Green Hydrogen renewables",
   "commodity": "Steel",
   "distance_km": 6082,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0248,
   "co2_kg_per_t": 150.6,
   "transport_usd_per_t": 122.73,
   "flow_tons": 105203,
   "flow_units": 105203,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_TATA_NL",
   "target": "DEM_DOGGER",
   "corridor": "IJmuiden to Dogger Bank Wind Farm",
   "commodity": "Steel",
   "distance_km": 724,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0618,
   "co2_kg_per_t": 44.7,
   "transport_usd_per_t": 42.36,
   "flow_tons": 87083,
   "flow_units": 87083,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "UK"
  },
  {
   "source": "SUP_SSAB",
   "target": "DEM_DOGGER",
   "corridor": "Lulea to Dogger Bank Wind Farm",
   "commodity": "Steel",
   "distance_km": 2495,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.032,
   "co2_kg_per_t": 79.7,
   "transport_usd_per_t": 68.92,
   "flow_tons": 56317,
   "flow_units": 56317,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "UK"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_BHADLA",
   "corridor": "Mussafah, Abu Dhabi to Bhadla Solar Park",
   "commodity": "Steel",
   "distance_km": 2696,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.031,
   "co2_kg_per_t": 83.7,
   "transport_usd_per_t": 71.94,
   "flow_tons": 50812,
   "flow_units": 50812,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "India"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_DHAFRA",
   "corridor": "Mussafah, Abu Dhabi to Al Dhafra Solar PV",
   "commodity": "Steel",
   "distance_km": 33,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0674,
   "co2_kg_per_t": 2.2,
   "transport_usd_per_t": 4.24,
   "flow_tons": 45267,
   "flow_units": 45267,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_ADANI",
   "target": "DEM_BHADLA",
   "corridor": "Mundra, Gujarat to Bhadla Solar Park",
   "commodity": "PV modules",
   "distance_km": 708,
   "mode": "Freight rail",
   "mode_class": "rail",
   "ef_kg_per_tkm": 0.0347,
   "co2_kg_per_t": 24.6,
   "transport_usd_per_t": 35.38,
   "flow_tons": 44152,
   "flow_units": 44152,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "India"
  },
  {
   "source": "SUP_LONGI",
   "target": "DEM_NEOM",
   "corridor": "Xi'an, Shaanxi to NEOM Green Hydrogen renewables",
   "commodity": "PV modules",
   "distance_km": 9603,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0229,
   "co2_kg_per_t": 220.3,
   "transport_usd_per_t": 175.55,
   "flow_tons": 43267,
   "flow_units": 43267,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_MBR6",
   "corridor": "Mussafah, Abu Dhabi to MBR Solar Park Phase 6",
   "commodity": "Steel",
   "distance_km": 123,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0684,
   "co2_kg_per_t": 8.4,
   "transport_usd_per_t": 16.02,
   "flow_tons": 40740,
   "flow_units": 40740,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_ADANI",
   "target": "DEM_DHAFRA",
   "corridor": "Mundra, Gujarat to Al Dhafra Solar PV",
   "commodity": "PV modules",
   "distance_km": 2396,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0325,
   "co2_kg_per_t": 77.8,
   "transport_usd_per_t": 67.45,
   "flow_tons": 39333,
   "flow_units": 39333,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_BENBAN",
   "corridor": "Mussafah, Abu Dhabi to Benban Solar Park",
   "commodity": "Steel",
   "distance_km": 3273,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0291,
   "co2_kg_per_t": 95.1,
   "transport_usd_per_t": 80.6,
   "flow_tons": 37345,
   "flow_units": 37345,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Egypt"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_KHAZNA",
   "corridor": "Mussafah, Abu Dhabi to Khazna Solar PV",
   "commodity": "Steel",
   "distance_km": 79,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0681,
   "co2_kg_per_t": 5.4,
   "transport_usd_per_t": 10.25,
   "flow_tons": 33950,
   "flow_units": 33950,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_SSAB",
   "target": "DEM_SUDAIR",
   "corridor": "Lulea to Sudair Solar PV",
   "commodity": "Steel",
   "distance_km": 6725,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0243,
   "co2_kg_per_t": 163.3,
   "transport_usd_per_t": 132.37,
   "flow_tons": 33950,
   "flow_units": 33950,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_SSAB",
   "target": "DEM_EMPIRE",
   "corridor": "Lulea to Empire Wind 1",
   "commodity": "Steel",
   "distance_km": 8714,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0233,
   "co2_kg_per_t": 202.7,
   "transport_usd_per_t": 162.21,
   "flow_tons": 32265,
   "flow_units": 32265,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_SSAB",
   "target": "DEM_SAMSON",
   "corridor": "Lulea to Samson Solar Energy Center",
   "commodity": "Steel",
   "distance_km": 10786,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0226,
   "co2_kg_per_t": 243.6,
   "transport_usd_per_t": 193.28,
   "flow_tons": 29650,
   "flow_units": 29650,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_LONGI",
   "target": "DEM_SUDAIR",
   "corridor": "Xi'an, Shaanxi to Sudair Solar PV",
   "commodity": "PV modules",
   "distance_km": 8521,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0233,
   "co2_kg_per_t": 198.9,
   "transport_usd_per_t": 159.31,
   "flow_tons": 29500,
   "flow_units": 29500,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_ADANI",
   "target": "DEM_KHAZNA",
   "corridor": "Mundra, Gujarat to Khazna Solar PV",
   "commodity": "PV modules",
   "distance_km": 2322,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0329,
   "co2_kg_per_t": 76.3,
   "transport_usd_per_t": 66.33,
   "flow_tons": 29500,
   "flow_units": 29500,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_TATA_NL",
   "target": "DEM_LAGOA",
   "corridor": "IJmuiden to Lagoa dos Ventos I and II",
   "commodity": "Steel",
   "distance_km": 11184,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0225,
   "co2_kg_per_t": 251.5,
   "transport_usd_per_t": 199.26,
   "flow_tons": 28521,
   "flow_units": 28521,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "Brazil"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_NOOR_AD",
   "corridor": "Mussafah, Abu Dhabi to Noor Abu Dhabi",
   "commodity": "Steel",
   "distance_km": 108,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.068,
   "co2_kg_per_t": 7.3,
   "transport_usd_per_t": 13.99,
   "flow_tons": 26639,
   "flow_units": 26639,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_LONGI",
   "target": "DEM_MBR6",
   "corridor": "Xi'an, Shaanxi to MBR Solar Park Phase 6",
   "commodity": "PV modules",
   "distance_km": 7362,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0239,
   "co2_kg_per_t": 175.9,
   "transport_usd_per_t": 141.92,
   "flow_tons": 26519,
   "flow_units": 26519,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_FIRST_SOLAR",
   "target": "DEM_SAMSON",
   "corridor": "Perrysburg, Ohio to Samson Solar Energy Center",
   "commodity": "PV modules",
   "distance_km": 1712,
   "mode": "Freight rail",
   "mode_class": "rail",
   "ef_kg_per_tkm": 0.0347,
   "co2_kg_per_t": 59.4,
   "transport_usd_per_t": 85.59,
   "flow_tons": 25763,
   "flow_units": 25763,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_ADANI",
   "target": "DEM_NOOR_AD",
   "corridor": "Mundra, Gujarat to Noor Abu Dhabi",
   "commodity": "PV modules",
   "distance_km": 2291,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.033,
   "co2_kg_per_t": 75.7,
   "transport_usd_per_t": 65.87,
   "flow_tons": 23148,
   "flow_units": 23148,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_FIRST_SOLAR",
   "target": "DEM_BENBAN",
   "corridor": "Perrysburg, Ohio to Benban Solar Park",
   "commodity": "PV modules",
   "distance_km": 14051,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0219,
   "co2_kg_per_t": 308.2,
   "transport_usd_per_t": 242.26,
   "flow_tons": 20897,
   "flow_units": 20897,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Egypt"
  },
  {
   "source": "SUP_SSAB",
   "target": "DEM_EDWARDS",
   "corridor": "Lulea to Edwards and Sanborn Solar",
   "commodity": "Steel",
   "distance_km": 11528,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0224,
   "co2_kg_per_t": 258.3,
   "transport_usd_per_t": 204.42,
   "flow_tons": 18265,
   "flow_units": 18265,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_KHARSAAH",
   "corridor": "Mussafah, Abu Dhabi to Al Kharsaah Solar PV",
   "commodity": "Steel",
   "distance_km": 451,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0683,
   "co2_kg_per_t": 30.8,
   "transport_usd_per_t": 58.67,
   "flow_tons": 18107,
   "flow_units": 18107,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Qatar"
  },
  {
   "source": "SUP_FIRST_SOLAR",
   "target": "DEM_EDWARDS",
   "corridor": "Perrysburg, Ohio to Edwards and Sanborn Solar",
   "commodity": "PV modules",
   "distance_km": 4439,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0266,
   "co2_kg_per_t": 118.2,
   "transport_usd_per_t": 98.08,
   "flow_tons": 15871,
   "flow_units": 15871,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_LONGI",
   "target": "DEM_KHARSAAH",
   "corridor": "Xi'an, Shaanxi to Al Kharsaah Solar PV",
   "commodity": "PV modules",
   "distance_km": 7863,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0236,
   "co2_kg_per_t": 185.9,
   "transport_usd_per_t": 149.45,
   "flow_tons": 15733,
   "flow_units": 15733,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Qatar"
  },
  {
   "source": "SUP_TATA_NL",
   "target": "DEM_WITZNITZ",
   "corridor": "IJmuiden to Witznitz Energy Park",
   "commodity": "Steel",
   "distance_km": 695,
   "mode": "Freight rail",
   "mode_class": "rail",
   "ef_kg_per_tkm": 0.0347,
   "co2_kg_per_t": 24.1,
   "transport_usd_per_t": 34.73,
   "flow_tons": 13693,
   "flow_units": 13693,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "Germany"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_TURKANA",
   "corridor": "Mussafah, Abu Dhabi to Lake Turkana Wind Power",
   "commodity": "Steel",
   "distance_km": 4464,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0266,
   "co2_kg_per_t": 118.7,
   "transport_usd_per_t": 98.46,
   "flow_tons": 12348,
   "flow_units": 12348,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Kenya"
  },
  {
   "source": "SUP_FIRST_SOLAR",
   "target": "DEM_WITZNITZ",
   "corridor": "Perrysburg, Ohio to Witznitz Energy Park",
   "commodity": "PV modules",
   "distance_km": 9629,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0229,
   "co2_kg_per_t": 220.8,
   "transport_usd_per_t": 175.93,
   "flow_tons": 11898,
   "flow_units": 11898,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "Germany"
  },
  {
   "source": "SUP_LONGI",
   "target": "DEM_BENBAN",
   "corridor": "Xi'an, Shaanxi to Benban Solar Park",
   "commodity": "PV modules",
   "distance_km": 10152,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0228,
   "co2_kg_per_t": 231.1,
   "transport_usd_per_t": 183.78,
   "flow_tons": 11553,
   "flow_units": 11553,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Egypt"
  },
  {
   "source": "SUP_TATA_NL",
   "target": "DEM_NUNEZ",
   "corridor": "IJmuiden to Nunez de Balboa PV",
   "commodity": "Steel",
   "distance_km": 2213,
   "mode": "Freight rail",
   "mode_class": "rail",
   "ef_kg_per_tkm": 0.0347,
   "co2_kg_per_t": 76.8,
   "transport_usd_per_t": 110.63,
   "flow_tons": 11317,
   "flow_units": 11317,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "Spain"
  },
  {
   "source": "SUP_FIRST_SOLAR",
   "target": "DEM_NUNEZ",
   "corridor": "Perrysburg, Ohio to Nunez de Balboa PV",
   "commodity": "PV modules",
   "distance_km": 8919,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0232,
   "co2_kg_per_t": 206.7,
   "transport_usd_per_t": 165.28,
   "flow_tons": 9833,
   "flow_units": 9833,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "Spain"
  },
  {
   "source": "SUP_ADANI",
   "target": "DEM_MBR6",
   "corridor": "Mundra, Gujarat to MBR Solar Park Phase 6",
   "commodity": "PV modules",
   "distance_km": 2291,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.033,
   "co2_kg_per_t": 75.7,
   "transport_usd_per_t": 65.86,
   "flow_tons": 8881,
   "flow_units": 8881,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_NEOM",
   "corridor": "Mussafah, Abu Dhabi to NEOM Green Hydrogen renewables",
   "commodity": "Steel",
   "distance_km": 2940,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0301,
   "co2_kg_per_t": 88.5,
   "transport_usd_per_t": 75.6,
   "flow_tons": 8323,
   "flow_units": 8323,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_EMSTEEL",
   "target": "DEM_REDSEA",
   "corridor": "Mussafah, Abu Dhabi to Red Sea destination solar",
   "commodity": "Steel",
   "distance_km": 2694,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0311,
   "co2_kg_per_t": 83.7,
   "transport_usd_per_t": 71.91,
   "flow_tons": 7695,
   "flow_units": 7695,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_VESTAS",
   "target": "DEM_DOGGER",
   "corridor": "Aarhus to Dogger Bank Wind Farm",
   "commodity": "Wind turbine components",
   "distance_km": 1034,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0492,
   "co2_kg_per_t": 50.9,
   "transport_usd_per_t": 47.02,
   "flow_tons": 7654,
   "flow_units": 7654,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "UK"
  },
  {
   "source": "SUP_LONGI",
   "target": "DEM_REDSEA",
   "corridor": "Xi'an, Shaanxi to Red Sea destination solar",
   "commodity": "PV modules",
   "distance_km": 9563,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0229,
   "co2_kg_per_t": 219.5,
   "transport_usd_per_t": 174.95,
   "flow_tons": 6687,
   "flow_units": 6687,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_NEOM",
   "corridor": "Sunndalsora to NEOM Green Hydrogen renewables",
   "commodity": "Aluminium",
   "distance_km": 6136,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0247,
   "co2_kg_per_t": 151.7,
   "transport_usd_per_t": 123.55,
   "flow_tons": 6060,
   "flow_units": 6060,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_SSAB",
   "target": "DEM_AKITA",
   "corridor": "Lulea to Akita and Noshiro offshore wind",
   "commodity": "Steel",
   "distance_km": 9917,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0228,
   "co2_kg_per_t": 226.5,
   "transport_usd_per_t": 180.26,
   "flow_tons": 5577,
   "flow_units": 5577,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "Japan"
  },
  {
   "source": "SUP_EGA",
   "target": "DEM_DHAFRA",
   "corridor": "Jebel Ali, Dubai to Al Dhafra Solar PV",
   "commodity": "Aluminium",
   "distance_km": 141,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0681,
   "co2_kg_per_t": 9.6,
   "transport_usd_per_t": 18.29,
   "flow_tons": 5000,
   "flow_units": 5000,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_EGA",
   "target": "DEM_MBR6",
   "corridor": "Jebel Ali, Dubai to MBR Solar Park Phase 6",
   "commodity": "Aluminium",
   "distance_km": 51,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0688,
   "co2_kg_per_t": 3.5,
   "transport_usd_per_t": 6.68,
   "flow_tons": 4500,
   "flow_units": 4500,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_ELSEWEDY",
   "target": "DEM_NEOM",
   "corridor": "10th of Ramadan City to NEOM Green Hydrogen renewables",
   "commodity": "Copper cable",
   "distance_km": 883,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0542,
   "co2_kg_per_t": 47.9,
   "transport_usd_per_t": 44.75,
   "flow_tons": 4493,
   "flow_units": 4493,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_EGA",
   "target": "DEM_KHAZNA",
   "corridor": "Jebel Ali, Dubai to Khazna Solar PV",
   "commodity": "Aluminium",
   "distance_km": 113,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.068,
   "co2_kg_per_t": 7.7,
   "transport_usd_per_t": 14.64,
   "flow_tons": 3750,
   "flow_units": 3750,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_MAADEN",
   "target": "DEM_SUDAIR",
   "corridor": "Ras Al Khair to Sudair Solar PV",
   "commodity": "Aluminium",
   "distance_km": 536,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.101,
   "co2_kg_per_t": 54.1,
   "transport_usd_per_t": 69.7,
   "flow_tons": 3750,
   "flow_units": 3750,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_DUCAB",
   "target": "DEM_BHADLA",
   "corridor": "Jebel Ali, Dubai to Bhadla Solar Park",
   "commodity": "Copper cable",
   "distance_km": 2593,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0315,
   "co2_kg_per_t": 81.7,
   "transport_usd_per_t": 70.4,
   "flow_tons": 3384,
   "flow_units": 3384,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "India"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_SAMSON",
   "corridor": "Sunndalsora to Samson Solar Energy Center",
   "commodity": "Aluminium",
   "distance_km": 10280,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0227,
   "co2_kg_per_t": 233.6,
   "transport_usd_per_t": 185.7,
   "flow_tons": 3275,
   "flow_units": 3275,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_EGA",
   "target": "DEM_BHADLA",
   "corridor": "Jebel Ali, Dubai to Bhadla Solar Park",
   "commodity": "Aluminium",
   "distance_km": 2595,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0315,
   "co2_kg_per_t": 81.7,
   "transport_usd_per_t": 70.42,
   "flow_tons": 3246,
   "flow_units": 3246,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "India"
  },
  {
   "source": "SUP_DUCAB",
   "target": "DEM_DHAFRA",
   "corridor": "Jebel Ali, Dubai to Al Dhafra Solar PV",
   "commodity": "Copper cable",
   "distance_km": 138,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0684,
   "co2_kg_per_t": 9.4,
   "transport_usd_per_t": 17.98,
   "flow_tons": 3067,
   "flow_units": 3067,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_EGA",
   "target": "DEM_NOOR_AD",
   "corridor": "Jebel Ali, Dubai to Noor Abu Dhabi",
   "commodity": "Aluminium",
   "distance_km": 82,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0682,
   "co2_kg_per_t": 5.6,
   "transport_usd_per_t": 10.65,
   "flow_tons": 2942,
   "flow_units": 2942,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_DUCAB",
   "target": "DEM_MBR6",
   "corridor": "Jebel Ali, Dubai to MBR Solar Park Phase 6",
   "commodity": "Copper cable",
   "distance_km": 47,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0678,
   "co2_kg_per_t": 3.2,
   "transport_usd_per_t": 6.07,
   "flow_tons": 2760,
   "flow_units": 2760,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_BENBAN",
   "corridor": "Sunndalsora to Benban Solar Park",
   "commodity": "Aluminium",
   "distance_km": 6531,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0244,
   "co2_kg_per_t": 159.5,
   "transport_usd_per_t": 129.46,
   "flow_tons": 2631,
   "flow_units": 2631,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Egypt"
  },
  {
   "source": "SUP_GOLDWIND",
   "target": "DEM_NEOM",
   "corridor": "Beijing to NEOM Green Hydrogen renewables",
   "commodity": "Wind turbine components",
   "distance_km": 10219,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0227,
   "co2_kg_per_t": 232.4,
   "transport_usd_per_t": 184.79,
   "flow_tons": 2627,
   "flow_units": 2627,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_ELSEWEDY",
   "target": "DEM_BENBAN",
   "corridor": "10th of Ramadan City to Benban Solar Park",
   "commodity": "Copper cable",
   "distance_km": 821,
   "mode": "Diesel HGV",
   "mode_class": "road_diesel",
   "ef_kg_per_tkm": 0.1211,
   "co2_kg_per_t": 99.4,
   "transport_usd_per_t": 98.48,
   "flow_tons": 2530,
   "flow_units": 2530,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Egypt"
  },
  {
   "source": "SUP_NKT",
   "target": "DEM_DOGGER",
   "corridor": "Karlskrona to Dogger Bank Wind Farm",
   "commodity": "Copper cable",
   "distance_km": 1480,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0403,
   "co2_kg_per_t": 59.7,
   "transport_usd_per_t": 53.7,
   "flow_tons": 2520,
   "flow_units": 2520,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "UK"
  },
  {
   "source": "SUP_MAADEN",
   "target": "DEM_BHADLA",
   "corridor": "Ras Al Khair to Bhadla Solar Park",
   "commodity": "Aluminium",
   "distance_km": 3315,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0289,
   "co2_kg_per_t": 95.9,
   "transport_usd_per_t": 81.22,
   "flow_tons": 2366,
   "flow_units": 2366,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "India"
  },
  {
   "source": "SUP_DUCAB",
   "target": "DEM_KHAZNA",
   "corridor": "Jebel Ali, Dubai to Khazna Solar PV",
   "commodity": "Copper cable",
   "distance_km": 108,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0685,
   "co2_kg_per_t": 7.4,
   "transport_usd_per_t": 14.09,
   "flow_tons": 2300,
   "flow_units": 2300,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_ELSEWEDY",
   "target": "DEM_SUDAIR",
   "corridor": "10th of Ramadan City to Sudair Solar PV",
   "commodity": "Copper cable",
   "distance_km": 2274,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0331,
   "co2_kg_per_t": 75.4,
   "transport_usd_per_t": 65.62,
   "flow_tons": 2300,
   "flow_units": 2300,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_SGRE",
   "target": "DEM_EMPIRE",
   "corridor": "Zamudio, Bilbao to Empire Wind 1",
   "commodity": "Wind turbine components",
   "distance_km": 7965,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0236,
   "co2_kg_per_t": 187.9,
   "transport_usd_per_t": 150.98,
   "flow_tons": 2160,
   "flow_units": 2160,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_EDWARDS",
   "corridor": "Sunndalsora to Edwards and Sanborn Solar",
   "commodity": "Aluminium",
   "distance_km": 11318,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0225,
   "co2_kg_per_t": 254.2,
   "transport_usd_per_t": 201.27,
   "flow_tons": 2018,
   "flow_units": 2018,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_MAADEN",
   "target": "DEM_KHARSAAH",
   "corridor": "Ras Al Khair to Al Kharsaah Solar PV",
   "commodity": "Aluminium",
   "distance_km": 391,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.1011,
   "co2_kg_per_t": 39.5,
   "transport_usd_per_t": 50.89,
   "flow_tons": 2000,
   "flow_units": 2000,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Qatar"
  },
  {
   "source": "SUP_NEXANS",
   "target": "DEM_SAMSON",
   "corridor": "Mohammedia to Samson Solar Energy Center",
   "commodity": "Copper cable",
   "distance_km": 10926,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0226,
   "co2_kg_per_t": 246.4,
   "transport_usd_per_t": 195.39,
   "flow_tons": 1980,
   "flow_units": 1980,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_SGRE",
   "target": "DEM_DOGGER",
   "corridor": "Zamudio, Bilbao to Dogger Bank Wind Farm",
   "commodity": "Wind turbine components",
   "distance_km": 2091,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0343,
   "co2_kg_per_t": 71.7,
   "transport_usd_per_t": 62.86,
   "flow_tons": 1946,
   "flow_units": 1946,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "UK"
  },
  {
   "source": "SUP_SGRE",
   "target": "DEM_LAGOA",
   "corridor": "Zamudio, Bilbao to Lagoa dos Ventos I and II",
   "commodity": "Wind turbine components",
   "distance_km": 9688,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0229,
   "co2_kg_per_t": 221.9,
   "transport_usd_per_t": 176.82,
   "flow_tons": 1909,
   "flow_units": 1909,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "Brazil"
  },
  {
   "source": "SUP_DUCAB",
   "target": "DEM_NOOR_AD",
   "corridor": "Jebel Ali, Dubai to Noor Abu Dhabi",
   "commodity": "Copper cable",
   "distance_km": 77,
   "mode": "Battery electric HGV",
   "mode_class": "road_bev",
   "ef_kg_per_tkm": 0.0683,
   "co2_kg_per_t": 5.3,
   "transport_usd_per_t": 10.02,
   "flow_tons": 1805,
   "flow_units": 1805,
   "status": "Balanced plan",
   "region": "UAE",
   "country": "UAE"
  },
  {
   "source": "SUP_SGRE",
   "target": "DEM_NEOM",
   "corridor": "Zamudio, Bilbao to NEOM Green Hydrogen renewables",
   "commodity": "Wind turbine components",
   "distance_km": 5436,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0254,
   "co2_kg_per_t": 137.9,
   "transport_usd_per_t": 113.05,
   "flow_tons": 1639,
   "flow_units": 1639,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_WITZNITZ",
   "corridor": "Sunndalsora to Witznitz Energy Park",
   "commodity": "Aluminium",
   "distance_km": 1628,
   "mode": "Freight rail",
   "mode_class": "rail",
   "ef_kg_per_tkm": 0.0347,
   "co2_kg_per_t": 56.5,
   "transport_usd_per_t": 81.41,
   "flow_tons": 1512,
   "flow_units": 1512,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "Germany"
  },
  {
   "source": "SUP_MAADEN",
   "target": "DEM_BENBAN",
   "corridor": "Ras Al Khair to Benban Solar Park",
   "commodity": "Aluminium",
   "distance_km": 2572,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0316,
   "co2_kg_per_t": 81.2,
   "transport_usd_per_t": 70.08,
   "flow_tons": 1494,
   "flow_units": 1494,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Egypt"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_DOGGER",
   "corridor": "Sunndalsora to Dogger Bank Wind Farm",
   "commodity": "Aluminium",
   "distance_km": 1590,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0389,
   "co2_kg_per_t": 61.8,
   "transport_usd_per_t": 55.35,
   "flow_tons": 1260,
   "flow_units": 1260,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "UK"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_NUNEZ",
   "corridor": "Sunndalsora to Nunez de Balboa PV",
   "commodity": "Aluminium",
   "distance_km": 4184,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.027,
   "co2_kg_per_t": 113.1,
   "transport_usd_per_t": 94.25,
   "flow_tons": 1250,
   "flow_units": 1250,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "Spain"
  },
  {
   "source": "SUP_NKT",
   "target": "DEM_EDWARDS",
   "corridor": "Karlskrona to Edwards and Sanborn Solar",
   "commodity": "Copper cable",
   "distance_km": 12412,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0222,
   "co2_kg_per_t": 275.8,
   "transport_usd_per_t": 217.67,
   "flow_tons": 1237,
   "flow_units": 1237,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_ELSEWEDY",
   "target": "DEM_KHARSAAH",
   "corridor": "10th of Ramadan City to Al Kharsaah Solar PV",
   "commodity": "Copper cable",
   "distance_km": 2971,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.03,
   "co2_kg_per_t": 89.1,
   "transport_usd_per_t": 76.06,
   "flow_tons": 1227,
   "flow_units": 1227,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Qatar"
  },
  {
   "source": "SUP_NKT",
   "target": "DEM_WITZNITZ",
   "corridor": "Karlskrona to Witznitz Energy Park",
   "commodity": "Copper cable",
   "distance_km": 744,
   "mode": "Freight rail",
   "mode_class": "rail",
   "ef_kg_per_tkm": 0.0347,
   "co2_kg_per_t": 25.8,
   "transport_usd_per_t": 37.2,
   "flow_tons": 928,
   "flow_units": 928,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "Germany"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_REDSEA",
   "corridor": "Sunndalsora to Red Sea destination solar",
   "commodity": "Aluminium",
   "distance_km": 6542,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0244,
   "co2_kg_per_t": 159.7,
   "transport_usd_per_t": 129.64,
   "flow_tons": 850,
   "flow_units": 850,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_GOLDWIND",
   "target": "DEM_TURKANA",
   "corridor": "Beijing to Lake Turkana Wind Power",
   "commodity": "Wind turbine components",
   "distance_km": 12373,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0222,
   "co2_kg_per_t": 275.0,
   "transport_usd_per_t": 217.09,
   "flow_tons": 827,
   "flow_units": 827,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Kenya"
  },
  {
   "source": "SUP_NEXANS",
   "target": "DEM_NUNEZ",
   "corridor": "Mohammedia to Nunez de Balboa PV",
   "commodity": "Copper cable",
   "distance_km": 1023,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0495,
   "co2_kg_per_t": 50.6,
   "transport_usd_per_t": 46.84,
   "flow_tons": 767,
   "flow_units": 767,
   "status": "Balanced plan",
   "region": "Europe",
   "country": "Spain"
  },
  {
   "source": "SUP_NEXANS",
   "target": "DEM_EMPIRE",
   "corridor": "Mohammedia to Empire Wind 1",
   "commodity": "Copper cable",
   "distance_km": 8094,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0235,
   "co2_kg_per_t": 190.4,
   "transport_usd_per_t": 152.91,
   "flow_tons": 567,
   "flow_units": 567,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_ELSEWEDY",
   "target": "DEM_REDSEA",
   "corridor": "10th of Ramadan City to Red Sea destination solar",
   "commodity": "Copper cable",
   "distance_km": 1285,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0434,
   "co2_kg_per_t": 55.8,
   "transport_usd_per_t": 50.78,
   "flow_tons": 521,
   "flow_units": 521,
   "status": "Balanced plan",
   "region": "Middle East",
   "country": "Saudi Arabia"
  },
  {
   "source": "SUP_NEXANS",
   "target": "DEM_LAGOA",
   "corridor": "Mohammedia to Lagoa dos Ventos I and II",
   "commodity": "Copper cable",
   "distance_km": 8283,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0234,
   "co2_kg_per_t": 194.2,
   "transport_usd_per_t": 155.74,
   "flow_tons": 501,
   "flow_units": 501,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "Brazil"
  },
  {
   "source": "SUP_GOLDWIND",
   "target": "DEM_AKITA",
   "corridor": "Beijing to Akita and Noshiro offshore wind",
   "commodity": "Wind turbine components",
   "distance_km": 3008,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0299,
   "co2_kg_per_t": 89.9,
   "transport_usd_per_t": 76.62,
   "flow_tons": 373,
   "flow_units": 373,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "Japan"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_EMPIRE",
   "corridor": "Sunndalsora to Empire Wind 1",
   "commodity": "Aluminium",
   "distance_km": 8018,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0236,
   "co2_kg_per_t": 188.9,
   "transport_usd_per_t": 151.77,
   "flow_tons": 284,
   "flow_units": 284,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_LAGOA",
   "corridor": "Sunndalsora to Lagoa dos Ventos I and II",
   "commodity": "Aluminium",
   "distance_km": 12426,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0222,
   "co2_kg_per_t": 276.1,
   "transport_usd_per_t": 217.88,
   "flow_tons": 251,
   "flow_units": 251,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "Brazil"
  },
  {
   "source": "SUP_ELSEWEDY",
   "target": "DEM_TURKANA",
   "corridor": "10th of Ramadan City to Lake Turkana Wind Power",
   "commodity": "Copper cable",
   "distance_km": 4533,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0265,
   "co2_kg_per_t": 120.0,
   "transport_usd_per_t": 99.5,
   "flow_tons": 217,
   "flow_units": 217,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Kenya"
  },
  {
   "source": "SUP_MAADEN",
   "target": "DEM_TURKANA",
   "corridor": "Ras Al Khair to Lake Turkana Wind Power",
   "commodity": "Aluminium",
   "distance_km": 4459,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0266,
   "co2_kg_per_t": 118.6,
   "transport_usd_per_t": 98.39,
   "flow_tons": 108,
   "flow_units": 108,
   "status": "Balanced plan",
   "region": "Africa",
   "country": "Kenya"
  },
  {
   "source": "SUP_NKT",
   "target": "DEM_AKITA",
   "corridor": "Karlskrona to Akita and Noshiro offshore wind",
   "commodity": "Copper cable",
   "distance_km": 11254,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0225,
   "co2_kg_per_t": 252.9,
   "transport_usd_per_t": 200.31,
   "flow_tons": 98,
   "flow_units": 98,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "Japan"
  },
  {
   "source": "SUP_ELSEWEDY",
   "target": "DEM_BHADLA",
   "corridor": "10th of Ramadan City to Bhadla Solar Park",
   "commodity": "Copper cable",
   "distance_km": 5566,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0252,
   "co2_kg_per_t": 140.4,
   "transport_usd_per_t": 115.0,
   "flow_tons": 58,
   "flow_units": 58,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "India"
  },
  {
   "source": "SUP_HYDRO",
   "target": "DEM_AKITA",
   "corridor": "Sunndalsora to Akita and Noshiro offshore wind",
   "commodity": "Aluminium",
   "distance_km": 10841,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0226,
   "co2_kg_per_t": 244.7,
   "transport_usd_per_t": 194.12,
   "flow_tons": 49,
   "flow_units": 49,
   "status": "Balanced plan",
   "region": "Asia Pacific",
   "country": "Japan"
  },
  {
   "source": "SUP_NKT",
   "target": "DEM_SAMSON",
   "corridor": "Karlskrona to Samson Solar Energy Center",
   "commodity": "Copper cable",
   "distance_km": 11254,
   "mode": "Container ship with road drayage",
   "mode_class": "sea_container",
   "ef_kg_per_tkm": 0.0225,
   "co2_kg_per_t": 252.9,
   "transport_usd_per_t": 200.31,
   "flow_tons": 28,
   "flow_units": 28,
   "status": "Balanced plan",
   "region": "Americas",
   "country": "USA"
  }
 ],
 "pareto": [
  {
   "strategy": "Cheapest plan",
   "role": "representative",
   "cost": 4645695094,
   "co2": 4045010.8,
   "social": 0.4719,
   "topsis": 0.3569,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 82%, Diesel HGV 17%, Freight rail 1%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 2",
   "role": null,
   "cost": 4645744211,
   "co2": 4037772.2,
   "social": 0.4718,
   "topsis": 0.357,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 82%, Diesel HGV 17%, Freight rail 1%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 3",
   "role": null,
   "cost": 4645806739,
   "co2": 4030533.6,
   "social": 0.4717,
   "topsis": 0.3572,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 82%, Diesel HGV 17%, Freight rail 1%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Carbon-aware plan",
   "role": "representative",
   "cost": 4645887357,
   "co2": 4023295.1,
   "social": 0.4716,
   "topsis": 0.3574,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 82%, Diesel HGV 17%, Freight rail 1%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 5",
   "role": null,
   "cost": 4646016599,
   "co2": 4016056.5,
   "social": 0.4737,
   "topsis": 0.3635,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 82%, Diesel HGV 17%, Freight rail 1%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 6",
   "role": null,
   "cost": 4646327521,
   "co2": 4008817.9,
   "social": 0.484,
   "topsis": 0.3997,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 82%, Diesel HGV 17%, Freight rail 1%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 7",
   "role": null,
   "cost": 4646653496,
   "co2": 4001579.3,
   "social": 0.4942,
   "topsis": 0.45,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 82%, Diesel HGV 17%, Freight rail 1%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 8",
   "role": null,
   "cost": 4647047493,
   "co2": 3994340.8,
   "social": 0.5045,
   "topsis": 0.513,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 81%, Diesel HGV 17%, Freight rail 2%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 9",
   "role": null,
   "cost": 4647828856,
   "co2": 3987102.2,
   "social": 0.5156,
   "topsis": 0.5926,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 81%, Diesel HGV 17%, Freight rail 2%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 10",
   "role": null,
   "cost": 4648748268,
   "co2": 3979863.6,
   "social": 0.5244,
   "topsis": 0.6625,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_GEV",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 78%, Battery electric HGV 16%, Freight rail 4%",
   "unmet_t": 0,
   "description": "15 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, GE Vernova, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Deep-decarbonisation plan",
   "role": "representative",
   "cost": 4684049873,
   "co2": 3972625.1,
   "social": 0.5244,
   "topsis": 0.6542,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_FIRST_SOLAR",
    "SUP_GOLDWIND",
    "SUP_HYDRO",
    "SUP_JINKO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NEXANS",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 76%, Battery electric HGV 17%, Freight rail 7%",
   "unmet_t": 0,
   "description": "18 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, First Solar, Goldwind, Norsk Hydro, JinkoSolar, LONGi Green Energy, Ma'aden Aluminium, Nexans Maroc, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 12",
   "role": null,
   "cost": 4731137853,
   "co2": 3965386.5,
   "social": 0.527,
   "topsis": 0.6619,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_FIRST_SOLAR",
    "SUP_GOLDWIND",
    "SUP_HYDRO",
    "SUP_JINKO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NEXANS",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 75%, Battery electric HGV 17%, Freight rail 8%",
   "unmet_t": 0,
   "description": "18 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, First Solar, Goldwind, Norsk Hydro, JinkoSolar, LONGi Green Energy, Ma'aden Aluminium, Nexans Maroc, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Efficient plan 13",
   "role": null,
   "cost": 4793521235,
   "co2": 3958147.9,
   "social": 0.5305,
   "topsis": 0.6654,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_FIRST_SOLAR",
    "SUP_GOLDWIND",
    "SUP_HYDRO",
    "SUP_JINKO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NEXANS",
    "SUP_NKT",
    "SUP_QCELLS",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 75%, Battery electric HGV 17%, Freight rail 8%",
   "unmet_t": 0,
   "description": "18 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, First Solar, Goldwind, Norsk Hydro, JinkoSolar, LONGi Green Energy, Ma'aden Aluminium, Nexans Maroc, NKT, Hanwha Qcells, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Balanced plan (TOPSIS)",
   "role": "representative",
   "cost": 4914395894,
   "co2": 3950909.3,
   "social": 0.5405,
   "topsis": 0.6729,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_FIRST_SOLAR",
    "SUP_GOLDWIND",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NEXANS",
    "SUP_NKT",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 75%, Battery electric HGV 17%, Freight rail 8%",
   "unmet_t": 0,
   "description": "16 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, First Solar, Goldwind, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, Nexans Maroc, NKT, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  },
  {
   "strategy": "Lowest-carbon plan",
   "role": "representative",
   "cost": 5113680307,
   "co2": 3943670.8,
   "social": 0.5613,
   "topsis": 0.6437,
   "suppliers": [
    "SUP_ADANI",
    "SUP_DUCAB",
    "SUP_EGA",
    "SUP_ELSEWEDY",
    "SUP_EMSTEEL",
    "SUP_FIRST_SOLAR",
    "SUP_GOLDWIND",
    "SUP_HYDRO",
    "SUP_LONGI",
    "SUP_MAADEN",
    "SUP_NEXANS",
    "SUP_NKT",
    "SUP_SGRE",
    "SUP_SSAB",
    "SUP_TATA_NL",
    "SUP_VESTAS"
   ],
   "mode": "Container ship 75%, Battery electric HGV 17%, Freight rail 8%",
   "unmet_t": 0,
   "description": "16 suppliers: Adani Solar (Adani Enterprises), Ducab, Emirates Global Aluminium, Elsewedy Electric, EMSTEEL, First Solar, Goldwind, Norsk Hydro, LONGi Green Energy, Ma'aden Aluminium, Nexans Maroc, NKT, Siemens Gamesa, SSAB, Tata Steel Nederland, Vestas."
  }
 ],
 "risk": {
  "assumptions": {
   "scenarios": 20,
   "seed": 7,
   "demand_sigma": 0.15,
   "supplier_outage_p": 0.05,
   "red_sea_closure_p": 0.15,
   "hormuz_closure_p": 0.05,
   "reservation_share_of_price": 0.05
  },
  "n_scenarios": 20,
  "scenario_summary": {
   "red_sea_closures": 4,
   "hormuz_closures": 0,
   "supplier_outages": 24
  },
  "rp_expected_cost": 5216467616,
  "eev_expected_cost": 8627180895,
  "ws_expected_cost": 5130750682,
  "vss": 3410713279,
  "evpi": 85716934,
  "rp_var90": 5939737953,
  "rp_cvar90": 6299105147,
  "ev_var90": 15886067304,
  "ev_cvar90": 17273078555,
  "rp_costs": [
   4716959525,
   5073725109,
   4470203957,
   5117205826,
   5168986003,
   6456124597,
   5092211494,
   4708473150,
   4873646723,
   4739785085,
   5230350476,
   5939737953,
   5214576162,
   4640688558,
   5314958357,
   5301427895,
   5535821869,
   4533178445,
   6501452890,
   5699838239
  ],
  "ev_costs": [
   4633047840,
   6136564723,
   4819184420,
   7585860586,
   7257727823,
   17059473311,
   6294107908,
   9302061170,
   10198336063,
   4655972502,
   8154192047,
   6906122213,
   8689672024,
   4556523256,
   6577530144,
   5217788258,
   18873695050,
   12028745242,
   15886067304,
   7710946003
  ],
  "rp_expected_co2_t": 4045042.1,
  "rp_unmet_t": [
   0,
   0,
   0,
   0,
   107008,
   193747,
   0,
   0,
   0,
   0,
   0,
   158150,
   0,
   0,
   11584,
   90639,
   0,
   0,
   15407,
   141987
  ],
  "ev_unmet_t": [
   0,
   2682,
   5270,
   17303,
   265916,
   527743,
   11396,
   3256,
   17031,
   0,
   63467,
   180645,
   124280,
   0,
   53273,
   90639,
   302402,
   5276,
   184318,
   309251
  ],
  "rp_unmet_prob_by_hub": {
   "Akita and Noshiro offshore wind": 0.35,
   "Lagoa dos Ventos I and II": 0.35,
   "Samson Solar Energy Center": 0.3,
   "Edwards and Sanborn Solar": 0.3,
   "Lake Turkana Wind Power": 0.25,
   "Empire Wind 1": 0.25,
   "Bhadla Solar Park": 0.1,
   "Sudair Solar PV": 0.1,
   "Red Sea destination solar": 0.1,
   "NEOM Green Hydrogen renewables": 0.1,
   "Khazna Solar PV": 0.05,
   "Al Kharsaah Solar PV": 0.05,
   "Nunez de Balboa PV": 0.05,
   "Dogger Bank Wind Farm": 0.05
  },
  "ev_unmet_prob_by_hub": {
   "Akita and Noshiro offshore wind": 0.8,
   "Lagoa dos Ventos I and II": 0.75,
   "Edwards and Sanborn Solar": 0.7,
   "Samson Solar Energy Center": 0.65,
   "Lake Turkana Wind Power": 0.6,
   "Empire Wind 1": 0.5,
   "NEOM Green Hydrogen renewables": 0.45,
   "Sudair Solar PV": 0.35,
   "Bhadla Solar Park": 0.35,
   "Benban Solar Park": 0.2,
   "Khazna Solar PV": 0.2,
   "Red Sea destination solar": 0.2,
   "Nunez de Balboa PV": 0.2,
   "MBR Solar Park Phase 6": 0.15,
   "Noor Abu Dhabi": 0.15,
   "Al Dhafra Solar PV": 0.15,
   "Witznitz Energy Park": 0.15,
   "Dogger Bank Wind Farm": 0.1,
   "Al Kharsaah Solar PV": 0.1
  },
  "rp_contracts": [
   {
    "supplier": "JinkoSolar",
    "reserved_t": 145014
   },
   {
    "supplier": "LONGi Green Energy",
    "reserved_t": 145014
   },
   {
    "supplier": "Hanwha Qcells",
    "reserved_t": 124748
   },
   {
    "supplier": "Adani Solar (Adani Enterprises)",
    "reserved_t": 145014
   },
   {
    "supplier": "EMSTEEL",
    "reserved_t": 281227
   },
   {
    "supplier": "SSAB",
    "reserved_t": 281227
   },
   {
    "supplier": "Tata Steel Nederland",
    "reserved_t": 281227
   },
   {
    "supplier": "Emirates Global Aluminium",
    "reserved_t": 19439
   },
   {
    "supplier": "Ma'aden Aluminium",
    "reserved_t": 19439
   },
   {
    "supplier": "Norsk Hydro",
    "reserved_t": 19439
   },
   {
    "supplier": "Ducab",
    "reserved_t": 4756
   },
   {
    "supplier": "Elsewedy Electric",
    "reserved_t": 9322
   },
   {
    "supplier": "NKT",
    "reserved_t": 12189
   },
   {
    "supplier": "Prysmian",
    "reserved_t": 8207
   },
   {
    "supplier": "Nexans Maroc",
    "reserved_t": 7648
   },
   {
    "supplier": "Vestas",
    "reserved_t": 7654
   },
   {
    "supplier": "GE Vernova",
    "reserved_t": 7654
   },
   {
    "supplier": "Siemens Gamesa",
    "reserved_t": 7654
   },
   {
    "supplier": "Goldwind",
    "reserved_t": 3121
   }
  ],
  "ev_contracts": [
   {
    "supplier": "LONGi Green Energy",
    "reserved_t": 145014
   },
   {
    "supplier": "Hanwha Qcells",
    "reserved_t": 72507
   },
   {
    "supplier": "Adani Solar (Adani Enterprises)",
    "reserved_t": 145014
   },
   {
    "supplier": "EMSTEEL",
    "reserved_t": 281227
   },
   {
    "supplier": "SSAB",
    "reserved_t": 140613
   },
   {
    "supplier": "Tata Steel Nederland",
    "reserved_t": 281227
   },
   {
    "supplier": "Emirates Global Aluminium",
    "reserved_t": 19439
   },
   {
    "supplier": "Ma'aden Aluminium",
    "reserved_t": 15596
   },
   {
    "supplier": "Norsk Hydro",
    "reserved_t": 13562
   },
   {
    "supplier": "Ducab",
    "reserved_t": 13315
   },
   {
    "supplier": "Elsewedy Electric",
    "reserved_t": 11347
   },
   {
    "supplier": "NKT",
    "reserved_t": 8627
   },
   {
    "supplier": "Vestas",
    "reserved_t": 7654
   },
   {
    "supplier": "GE Vernova",
    "reserved_t": 4069
   },
   {
    "supplier": "Siemens Gamesa",
    "reserved_t": 7412
   }
  ]
 },
 "forecast": {
  "days_history": [
   1,
   2,
   3,
   4,
   5,
   6,
   7,
   8,
   9,
   10,
   11,
   12,
   13,
   14,
   15,
   16,
   17,
   18,
   19,
   20,
   21,
   22,
   23,
   24,
   25,
   26,
   27,
   28,
   29,
   30,
   31,
   32,
   33,
   34,
   35,
   36,
   37,
   38,
   39,
   40,
   41,
   42,
   43,
   44,
   45,
   46,
   47,
   48,
   49,
   50,
   51,
   52,
   53,
   54,
   55,
   56,
   57,
   58,
   59,
   60
  ],
  "days_forecast": [
   61,
   62,
   63,
   64,
   65,
   66,
   67,
   68,
   69,
   70,
   71,
   72,
   73,
   74,
   75,
   76,
   77,
   78,
   79,
   80,
   81,
   82,
   83,
   84,
   85,
   86,
   87,
   88,
   89,
   90
  ],
  "historical_clean_units": [
   121.0,
   121.1,
   127.1,
   130.6,
   137.5,
   139.7,
   143.0,
   138.3,
   140.6,
   137.0,
   136.6,
   136.2,
   129.9,
   127.7,
   127.3,
   123.1,
   117.4,
   117.1,
   116.2,
   108.9,
   113.6,
   112.8,
   111.2,
   111.7,
   119.9,
   118.9,
   121.0,
   125.3,
   135.0,
   137.8,
   143.5,
   146.8,
   148.7,
   154.4,
   152.0,
   154.1,
   156.1,
   153.7,
   153.7,
   149.3,
   147.2,
   139.3,
   137.0,
   133.9,
   129.0,
   127.2,
   123.8,
   123.4,
   125.0,
   123.1,
   124.0,
   124.7,
   127.7,
   135.7,
   137.5,
   141.5,
   142.9,
   151.3,
   151.6,
   156.9
  ],
  "model_forecast_units": [
   161.8,
   164.5,
   166.1,
   166.5,
   166.2,
   165.2,
   163.7,
   161.4,
   158.5,
   154.8,
   150.8,
   146.9,
   143.5,
   140.8,
   138.8,
   137.3,
   136.3,
   136.0,
   136.8,
   138.8,
   141.8,
   145.6,
   149.7,
   153.9,
   158.1,
   162.4,
   166.8,
   171.0,
   174.6,
   177.3
  ],
  "confidence_upper": [
   164.4,
   167.1,
   168.7,
   169.1,
   168.8,
   167.8,
   166.2,
   164.0,
   161.1,
   157.4,
   153.4,
   149.5,
   146.1,
   143.4,
   141.4,
   139.9,
   138.9,
   138.6,
   139.4,
   141.3,
   144.4,
   148.2,
   152.3,
   156.5,
   160.7,
   165.0,
   169.4,
   173.6,
   177.2,
   179.9
  ],
  "confidence_lower": [
   159.2,
   161.9,
   163.5,
   163.9,
   163.6,
   162.6,
   161.1,
   158.8,
   155.9,
   152.2,
   148.2,
   144.3,
   140.9,
   138.3,
   136.2,
   134.7,
   133.7,
   133.4,
   134.2,
   136.2,
   139.2,
   143.0,
   147.1,
   151.3,
   155.5,
   159.8,
   164.2,
   168.4,
   172.0,
   174.7
  ],
  "unit_label": "MW-equivalent procurement per day (synthetic history)",
  "model": "Least squares on trend plus 7 and 28 day Fourier terms; 80 percent interval from residual sd 2.03"
 },
 "region_demand": [
  {
   "region": "UAE",
   "demand_mw": 6477
  },
  {
   "region": "Middle East",
   "demand_mw": 6440
  },
  {
   "region": "Europe",
   "demand_mw": 4705
  },
  {
   "region": "Americas",
   "demand_mw": 3643
  },
  {
   "region": "Asia Pacific",
   "demand_mw": 2385
  },
  {
   "region": "Africa",
   "demand_mw": 1960
  }
 ],
 "esg_pillars": [
  {
   "pillar": "Economic",
   "score": 42.6,
   "benchmark": 100.0,
   "desc": "Annual procurement and freight cost placed between the cheapest plan (100) and the lowest-carbon plan (0)."
  },
  {
   "pillar": "Environmental",
   "score": 92.9,
   "benchmark": 0.0,
   "desc": "Annual CO2e (product footprints plus well-to-wheel freight) placed between the lowest-carbon plan (100) and the cheapest plan (0)."
  },
  {
   "pillar": "Social",
   "score": 63.8,
   "benchmark": 5.5,
   "desc": "Tonnage-weighted supplier social score placed between the best achievable (100) and the weakest plan on the front (0)."
  }
 ],
 "summary": {
  "total_suppliers": 21,
  "total_hubs": 19,
  "total_corridors": 87,
  "total_annual_demand_mw": 25610,
  "total_demand_t": 1166623,
  "annual_co2_abated_tons": 94097.4,
  "balanced_cost_usd": 4914395894,
  "balanced_co2_t": 3950909.3,
  "balanced_social": 0.5405,
  "balanced_suppliers": 16
 },
 "world_map_polygons": [
  [
   [
    -67.8,
    -53.9
   ],
   [
    -65,
    -54.7
   ],
   [
    -69.2,
    -55.5
   ],
   [
    -74.7,
    -52.8
   ],
   [
    -71.1,
    -54.1
   ],
   [
    -69.3,
    -52.5
   ],
   [
    -67.8,
    -53.9
   ]
  ],
  [
   [
    -58.5,
    -51.1
   ],
   [
    -58,
    -51.9
   ],
   [
    -61.2,
    -51.9
   ],
   [
    -58.5,
    -51.1
   ]
  ],
  [
   [
    70.3,
    -49.7
   ],
   [
    68.7,
    -49.8
   ],
   [
    68.9,
    -48.6
   ],
   [
    70.5,
    -49.1
   ],
   [
    70.3,
    -49.7
   ]
  ],
  [
   [
    145.4,
    -40.8
   ],
   [
    148.3,
    -40.9
   ],
   [
    147.9,
    -43.2
   ],
   [
    146.1,
    -43.5
   ],
   [
    144.7,
    -41.2
   ],
   [
    145.4,
    -40.8
   ]
  ],
  [
   [
    173,
    -40.9
   ],
   [
    174,
    -40.9
   ],
   [
    174.2,
    -41.8
   ],
   [
    172.7,
    -43.4
   ],
   [
    173.1,
    -43.9
   ],
   [
    171.4,
    -44.2
   ],
   [
    170.6,
    -45.9
   ],
   [
    169.3,
    -46.6
   ],
   [
    166.7,
    -46.2
   ],
   [
    167.1,
    -45.1
   ],
   [
    170.5,
    -43
   ],
   [
    172.1,
    -41
   ],
   [
    173,
    -40.9
   ]
  ],
  [
   [
    174.6,
    -36.2
   ],
   [
    176.8,
    -37.9
   ],
   [
    178.5,
    -37.7
   ],
   [
    178,
    -39.2
   ],
   [
    177.2,
    -39.1
   ],
   [
    175.2,
    -41.7
   ],
   [
    174.7,
    -41.3
   ],
   [
    174.9,
    -39.9
   ],
   [
    173.8,
    -39.5
   ],
   [
    174.7,
    -37.4
   ],
   [
    172.6,
    -34.5
   ],
   [
    174.3,
    -35.3
   ],
   [
    174.6,
    -36.2
   ]
  ],
  [
   [
    167.1,
    -22.2
   ],
   [
    165.5,
    -21.7
   ],
   [
    164,
    -20.1
   ],
   [
    167.1,
    -22.2
   ]
  ],
  [
   [
    178.4,
    -17.3
   ],
   [
    178.6,
    -18.1
   ],
   [
    177.4,
    -18.2
   ],
   [
    178.4,
    -17.3
   ]
  ],
  [
   [
    -180,
    -16.6
   ],
   [
    178.7,
    -17
   ],
   [
    179.4,
    -16.4
   ],
   [
    -179.8,
    -16
   ],
   [
    -180,
    -16.6
   ]
  ],
  [
   [
    167.1,
    -14.9
   ],
   [
    167.3,
    -15.7
   ],
   [
    166.7,
    -15.4
   ],
   [
    166.6,
    -14.6
   ],
   [
    167.1,
    -14.9
   ]
  ],
  [
   [
    50.1,
    -13.6
   ],
   [
    50.4,
    -15.7
   ],
   [
    49.7,
    -15.7
   ],
   [
    47.1,
    -24.9
   ],
   [
    45.4,
    -25.6
   ],
   [
    44,
    -25
   ],
   [
    43.2,
    -22.1
   ],
   [
    44.4,
    -20.1
   ],
   [
    44,
    -17.4
   ],
   [
    44.5,
    -16.2
   ],
   [
    47.7,
    -14.6
   ],
   [
    49.2,
    -12
   ],
   [
    50.1,
    -13.6
   ]
  ],
  [
   [
    143.6,
    -13.8
   ],
   [
    143.9,
    -14.6
   ],
   [
    144.6,
    -14.2
   ],
   [
    145.4,
    -15
   ],
   [
    146.4,
    -19
   ],
   [
    148.8,
    -20.4
   ],
   [
    149.7,
    -22.3
   ],
   [
    150.7,
    -22.4
   ],
   [
    153.1,
    -26.1
   ],
   [
    153.6,
    -28.1
   ],
   [
    153.1,
    -30.9
   ],
   [
    150.3,
    -35.7
   ],
   [
    150,
    -37.4
   ],
   [
    146.3,
    -39
   ],
   [
    144.9,
    -38.4
   ],
   [
    145,
    -37.9
   ],
   [
    143.6,
    -38.8
   ],
   [
    140.6,
    -38
   ],
   [
    139.6,
    -36.1
   ],
   [
    138.1,
    -35.6
   ],
   [
    138.2,
    -34.4
   ],
   [
    136.8,
    -35.3
   ],
   [
    137.8,
    -32.9
   ],
   [
    136,
    -34.9
   ],
   [
    134.3,
    -32.6
   ],
   [
    131.3,
    -31.5
   ],
   [
    126.2,
    -32.2
   ],
   [
    124.2,
    -33
   ],
   [
    123.7,
    -33.9
   ],
   [
    119.9,
    -34
   ],
   [
    118,
    -35.1
   ],
   [
    115,
    -34.2
   ],
   [
    115.7,
    -31.6
   ],
   [
    113.3,
    -26.1
   ],
   [
    113.8,
    -26.6
   ],
   [
    113.4,
    -25.6
   ],
   [
    114.2,
    -26.3
   ],
   [
    113.4,
    -24.4
   ],
   [
    114.2,
    -21.8
   ],
   [
    114.2,
    -22.5
   ],
   [
    116.7,
    -20.7
   ],
   [
    120.9,
    -19.7
   ],
   [
    123,
    -16.4
   ],
   [
    123.9,
    -17.1
   ],
   [
    123.5,
    -16.6
   ],
   [
    125.7,
    -14.2
   ],
   [
    127.1,
    -13.8
   ],
   [
    129.6,
    -15
   ],
   [
    130.6,
    -12.5
   ],
   [
    132.6,
    -12.1
   ],
   [
    131.8,
    -11.3
   ],
   [
    135.3,
    -12.2
   ],
   [
    136.5,
    -11.9
   ],
   [
    136.9,
    -12.3
   ],
   [
    135.5,
    -15
   ],
   [
    140.2,
    -17.7
   ],
   [
    141.7,
    -15
   ],
   [
    142.1,
    -11
   ],
   [
    142.8,
    -11.2
   ],
   [
    143.6,
    -13.8
   ]
  ],
  [
   [
    162.1,
    -10.5
   ],
   [
    161.7,
    -10.8
   ],
   [
    161.3,
    -10.2
   ],
   [
    162.1,
    -10.5
   ]
  ],
  [
   [
    120.7,
    -10.2
   ],
   [
    119,
    -9.6
   ],
   [
    119.9,
    -9.4
   ],
   [
    120.7,
    -10.2
   ]
  ],
  [
   [
    124.4,
    -10.1
   ],
   [
    123.5,
    -10.2
   ],
   [
    124,
    -9.3
   ],
   [
    127.3,
    -8.4
   ],
   [
    124.4,
    -10.1
   ]
  ],
  [
   [
    117.9,
    -8.1
   ],
   [
    119.1,
    -8.7
   ],
   [
    116.7,
    -9
   ],
   [
    117.9,
    -8.1
   ]
  ],
  [
   [
    122.9,
    -8.1
   ],
   [
    122.8,
    -8.7
   ],
   [
    119.9,
    -8.8
   ],
   [
    122.9,
    -8.1
   ]
  ],
  [
   [
    108.6,
    -6.8
   ],
   [
    110.8,
    -6.5
   ],
   [
    115.7,
    -8.4
   ],
   [
    114.6,
    -8.8
   ],
   [
    106.5,
    -7.4
   ],
   [
    105.4,
    -6.8
   ],
   [
    106,
    -5.9
   ],
   [
    108.6,
    -6.8
   ]
  ],
  [
   [
    134.7,
    -6.2
   ],
   [
    134.2,
    -6.9
   ],
   [
    134.5,
    -5.4
   ],
   [
    134.7,
    -6.2
   ]
  ],
  [
   [
    152,
    -5.5
   ],
   [
    150.2,
    -6.3
   ],
   [
    148.3,
    -5.8
   ],
   [
    150.1,
    -5
   ],
   [
    150.8,
    -5.5
   ],
   [
    151.5,
    -4.2
   ],
   [
    152.3,
    -4.3
   ],
   [
    152,
    -5.5
   ]
  ],
  [
   [
    130.5,
    -3.1
   ],
   [
    130.8,
    -3.9
   ],
   [
    127.9,
    -3.4
   ],
   [
    128.1,
    -2.8
   ],
   [
    130.5,
    -3.1
   ]
  ],
  [
   [
    153.1,
    -4.5
   ],
   [
    150.7,
    -2.7
   ],
   [
    152.2,
    -3.2
   ],
   [
    153.1,
    -4.5
   ]
  ],
  [
   [
    134.1,
    -1.1
   ],
   [
    134.4,
    -2.8
   ],
   [
    135.5,
    -3.4
   ],
   [
    136.3,
    -2.3
   ],
   [
    138.3,
    -1.7
   ],
   [
    144.6,
    -3.9
   ],
   [
    146,
    -5.5
   ],
   [
    147.7,
    -6.1
   ],
   [
    147.2,
    -7.4
   ],
   [
    150.7,
    -10.6
   ],
   [
    147.9,
    -10.1
   ],
   [
    146.1,
    -8.1
   ],
   [
    144.7,
    -7.6
   ],
   [
    142.6,
    -9.3
   ],
   [
    139.1,
    -8.1
   ],
   [
    137.6,
    -8.4
   ],
   [
    138.7,
    -7.3
   ],
   [
    137.9,
    -5.4
   ],
   [
    133.7,
    -3.5
   ],
   [
    133,
    -4.1
   ],
   [
    132,
    -2.8
   ],
   [
    133.7,
    -2.2
   ],
   [
    132.2,
    -2.2
   ],
   [
    130.5,
    -0.9
   ],
   [
    132.4,
    -0.4
   ],
   [
    134.1,
    -1.1
   ]
  ],
  [
   [
    125.2,
    1.4
   ],
   [
    123.7,
    0.2
   ],
   [
    120.2,
    0.2
   ],
   [
    120.9,
    -1.4
   ],
   [
    123.3,
    -0.6
   ],
   [
    121.5,
    -1.9
   ],
   [
    123.2,
    -5.3
   ],
   [
    122.2,
    -5.3
   ],
   [
    122.7,
    -4.5
   ],
   [
    121.5,
    -4.6
   ],
   [
    121,
    -2.6
   ],
   [
    120.3,
    -2.9
   ],
   [
    120.4,
    -5.5
   ],
   [
    119.4,
    -5.4
   ],
   [
    119.5,
    -3.5
   ],
   [
    118.8,
    -2.8
   ],
   [
    120,
    0.6
   ],
   [
    120.9,
    1.3
   ],
   [
    122.9,
    0.9
   ],
   [
    125.2,
    1.4
   ]
  ],
  [
   [
    128.7,
    1.1
   ],
   [
    128.1,
    -0.9
   ],
   [
    127.6,
    1.8
   ],
   [
    127.9,
    2.2
   ],
   [
    128.7,
    1.1
   ]
  ],
  [
   [
    105.8,
    -5.8
   ],
   [
    104.7,
    -5.9
   ],
   [
    102.6,
    -4.2
   ],
   [
    95.3,
    5.5
   ],
   [
    97.5,
    5.2
   ],
   [
    100.6,
    2.1
   ],
   [
    101.7,
    2.1
   ],
   [
    103.8,
    0.1
   ],
   [
    103.4,
    -0.7
   ],
   [
    106.1,
    -3.1
   ],
   [
    105.8,
    -5.8
   ]
  ],
  [
   [
    117.9,
    1.8
   ],
   [
    119,
    0.9
   ],
   [
    117.8,
    0.8
   ],
   [
    116.2,
    -4
   ],
   [
    110.2,
    -2.9
   ],
   [
    109.1,
    -0.5
   ],
   [
    109.7,
    2
   ],
   [
    111.2,
    1.9
   ],
   [
    111.4,
    2.7
   ],
   [
    113,
    3.1
   ],
   [
    116.7,
    6.9
   ],
   [
    119.2,
    5.4
   ],
   [
    117.3,
    3.2
   ],
   [
    117.9,
    1.8
   ]
  ],
  [
   [
    126.4,
    8.4
   ],
   [
    126.5,
    7.2
   ],
   [
    126.2,
    6.3
   ],
   [
    125.8,
    7.3
   ],
   [
    125.4,
    6.8
   ],
   [
    125.4,
    5.6
   ],
   [
    124.2,
    6.2
   ],
   [
    123.6,
    7.8
   ],
   [
    121.9,
    7.2
   ],
   [
    123.5,
    8.7
   ],
   [
    123.8,
    8.2
   ],
   [
    125.5,
    9
   ],
   [
    125.4,
    9.8
   ],
   [
    126.4,
    8.4
   ]
  ],
  [
   [
    81.2,
    6.2
   ],
   [
    80.3,
    6
   ],
   [
    79.9,
    6.8
   ],
   [
    80.2,
    9.8
   ],
   [
    81.8,
    7.5
   ],
   [
    81.2,
    6.2
   ]
  ],
  [
   [
    -60.9,
    10.1
   ],
   [
    -62,
    10.1
   ],
   [
    -61.1,
    10.9
   ],
   [
    -60.9,
    10.1
   ]
  ],
  [
   [
    124,
    10.3
   ],
   [
    123,
    9
   ],
   [
    122.4,
    9.7
   ],
   [
    123,
    10.9
   ],
   [
    123.5,
    10.9
   ],
   [
    123.3,
    10.3
   ],
   [
    124.1,
    11.2
   ],
   [
    124,
    10.3
   ]
  ],
  [
   [
    118.5,
    9.3
   ],
   [
    117.2,
    8.4
   ],
   [
    119.5,
    11.4
   ],
   [
    119.7,
    10.6
   ],
   [
    118.5,
    9.3
   ]
  ],
  [
   [
    121.9,
    11.9
   ],
   [
    123.1,
    11.6
   ],
   [
    122,
    10.4
   ],
   [
    121.9,
    11.9
   ]
  ],
  [
   [
    125.5,
    12.2
   ],
   [
    125.8,
    11.1
   ],
   [
    125,
    11.3
   ],
   [
    124.8,
    10.1
   ],
   [
    124.3,
    12.6
   ],
   [
    125.5,
    12.2
   ]
  ],
  [
   [
    121.5,
    13.1
   ],
   [
    121.3,
    12.2
   ],
   [
    120.3,
    13.5
   ],
   [
    121.5,
    13.1
   ]
  ],
  [
   [
    121.3,
    18.5
   ],
   [
    122.2,
    18.5
   ],
   [
    122.5,
    17.1
   ],
   [
    121.7,
    15.9
   ],
   [
    121.7,
    14.3
   ],
   [
    124,
    13.8
   ],
   [
    124.1,
    12.5
   ],
   [
    122.9,
    13.6
   ],
   [
    120.6,
    13.9
   ],
   [
    121,
    14.5
   ],
   [
    120.1,
    15
   ],
   [
    119.9,
    16.4
   ],
   [
    120.3,
    16
   ],
   [
    120.7,
    18.5
   ],
   [
    121.3,
    18.5
   ]
  ],
  [
   [
    -76.9,
    17.9
   ],
   [
    -78.3,
    18.2
   ],
   [
    -76.9,
    18.4
   ],
   [
    -76.2,
    17.9
   ],
   [
    -76.9,
    17.9
   ]
  ],
  [
   [
    -72.6,
    19.9
   ],
   [
    -70,
    19.6
   ],
   [
    -68.3,
    18.6
   ],
   [
    -70.7,
    18.4
   ],
   [
    -71.4,
    17.6
   ],
   [
    -73.9,
    18
   ],
   [
    -74.4,
    18.7
   ],
   [
    -72.3,
    18.7
   ],
   [
    -73.4,
    19.6
   ],
   [
    -72.6,
    19.9
   ]
  ],
  [
   [
    110.3,
    18.7
   ],
   [
    108.7,
    18.5
   ],
   [
    108.6,
    19.4
   ],
   [
    110.8,
    20.1
   ],
   [
    110.3,
    18.7
   ]
  ],
  [
   [
    -155.5,
    19.1
   ],
   [
    -155.9,
    20.3
   ],
   [
    -154.8,
    19.5
   ],
   [
    -155.5,
    19.1
   ]
  ],
  [
   [
    -79.7,
    22.8
   ],
   [
    -74.2,
    20.3
   ],
   [
    -77.8,
    19.9
   ],
   [
    -77.1,
    20.4
   ],
   [
    -78.7,
    21.6
   ],
   [
    -81.8,
    22.6
   ],
   [
    -85,
    21.9
   ],
   [
    -82.3,
    23.2
   ],
   [
    -79.7,
    22.8
   ]
  ],
  [
   [
    -77.5,
    23.8
   ],
   [
    -78.4,
    24.6
   ],
   [
    -78.2,
    25.2
   ],
   [
    -77.5,
    23.8
   ]
  ],
  [
   [
    121.2,
    22.8
   ],
   [
    120.8,
    22
   ],
   [
    120.1,
    23.6
   ],
   [
    121.5,
    25.3
   ],
   [
    122,
    25
   ],
   [
    121.2,
    22.8
   ]
  ],
  [
   [
    -77,
    26.6
   ],
   [
    -77.2,
    25.9
   ],
   [
    -77.8,
    27
   ],
   [
    -77,
    26.6
   ]
  ],
  [
   [
    134.6,
    34.1
   ],
   [
    134.2,
    33.2
   ],
   [
    132.4,
    33
   ],
   [
    132.9,
    34.1
   ],
   [
    134.6,
    34.1
   ]
  ],
  [
   [
    34.6,
    35.7
   ],
   [
    33,
    34.6
   ],
   [
    32.3,
    35.1
   ],
   [
    34.6,
    35.7
   ]
  ],
  [
   [
    23.7,
    35.7
   ],
   [
    26.3,
    35.3
   ],
   [
    24.7,
    34.9
   ],
   [
    23.5,
    35.3
   ],
   [
    23.7,
    35.7
   ]
  ],
  [
   [
    15.5,
    38.2
   ],
   [
    15.1,
    36.6
   ],
   [
    12.4,
    37.6
   ],
   [
    12.6,
    38.1
   ],
   [
    15.5,
    38.2
   ]
  ],
  [
   [
    9.2,
    41.2
   ],
   [
    9.7,
    39.2
   ],
   [
    8.8,
    38.9
   ],
   [
    8.2,
    41
   ],
   [
    9.2,
    41.2
   ]
  ],
  [
   [
    141,
    37.1
   ],
   [
    140.2,
    35.1
   ],
   [
    137.2,
    34.6
   ],
   [
    135.8,
    33.5
   ],
   [
    135.1,
    34.6
   ],
   [
    131,
    33.9
   ],
   [
    132,
    33.1
   ],
   [
    131.3,
    31.4
   ],
   [
    130.2,
    31.4
   ],
   [
    130.4,
    32.3
   ],
   [
    129.4,
    33.3
   ],
   [
    132.6,
    35.4
   ],
   [
    135.7,
    35.5
   ],
   [
    136.7,
    37.3
   ],
   [
    137.4,
    36.8
   ],
   [
    139.4,
    38.2
   ],
   [
    140.3,
    41.2
   ],
   [
    141.4,
    41.4
   ],
   [
    141.9,
    40
   ],
   [
    141,
    37.1
   ]
  ],
  [
   [
    9.6,
    42.1
   ],
   [
    9.2,
    41.4
   ],
   [
    8.5,
    42.3
   ],
   [
    9.4,
    43
   ],
   [
    9.6,
    42.1
   ]
  ],
  [
   [
    143.9,
    44.2
   ],
   [
    145.3,
    44.4
   ],
   [
    145.5,
    43.3
   ],
   [
    144.1,
    43
   ],
   [
    143.2,
    42
   ],
   [
    141.6,
    42.7
   ],
   [
    141.1,
    41.6
   ],
   [
    140,
    41.6
   ],
   [
    139.8,
    42.6
   ],
   [
    141.4,
    43.4
   ],
   [
    142,
    45.5
   ],
   [
    143.9,
    44.2
   ]
  ],
  [
   [
    -63.7,
    46.5
   ],
   [
    -62,
    46.4
   ],
   [
    -62.9,
    46
   ],
   [
    -63.7,
    46.5
   ]
  ],
  [
   [
    -123.5,
    48.5
   ],
   [
    -125.7,
    48.8
   ],
   [
    -128.1,
    50
   ],
   [
    -128.4,
    50.8
   ],
   [
    -125.8,
    50.3
   ],
   [
    -123.5,
    48.5
   ]
  ],
  [
   [
    -56.1,
    50.7
   ],
   [
    -56.8,
    49.8
   ],
   [
    -53.5,
    49.2
   ],
   [
    -53.8,
    48.5
   ],
   [
    -53.1,
    48.7
   ],
   [
    -52.6,
    47.5
   ],
   [
    -53.1,
    46.7
   ],
   [
    -54.2,
    46.8
   ],
   [
    -54.2,
    47.8
   ],
   [
    -55.4,
    46.9
   ],
   [
    -56,
    46.9
   ],
   [
    -55.3,
    47.4
   ],
   [
    -56.2,
    47.6
   ],
   [
    -59.3,
    47.6
   ],
   [
    -57.4,
    50.7
   ],
   [
    -55.9,
    51.6
   ],
   [
    -55.4,
    51.6
   ],
   [
    -56.1,
    50.7
   ]
  ],
  [
   [
    -132.7,
    54
   ],
   [
    -131.8,
    54.1
   ],
   [
    -132.1,
    53
   ],
   [
    -131.2,
    52.2
   ],
   [
    -133.1,
    53.4
   ],
   [
    -133.2,
    54.2
   ],
   [
    -132.7,
    54
   ]
  ],
  [
   [
    143.7,
    50.8
   ],
   [
    144.7,
    49
   ],
   [
    143.2,
    49.3
   ],
   [
    142.6,
    47.9
   ],
   [
    143.5,
    46.1
   ],
   [
    142.8,
    46.7
   ],
   [
    142.1,
    46
   ],
   [
    141.7,
    53.3
   ],
   [
    142.7,
    54.4
   ],
   [
    143.7,
    50.8
   ]
  ],
  [
   [
    -6.8,
    52.3
   ],
   [
    -10,
    51.8
   ],
   [
    -9.2,
    52.9
   ],
   [
    -9.7,
    53.9
   ],
   [
    -6.7,
    55.2
   ],
   [
    -5.7,
    54.6
   ],
   [
    -6.8,
    52.3
   ]
  ],
  [
   [
    12.7,
    55.6
   ],
   [
    12.1,
    54.8
   ],
   [
    10.9,
    55.8
   ],
   [
    12.4,
    56.1
   ],
   [
    12.7,
    55.6
   ]
  ],
  [
   [
    -153,
    57.1
   ],
   [
    -154,
    56.7
   ],
   [
    -154.7,
    57.5
   ],
   [
    -152.6,
    57.9
   ],
   [
    -152.1,
    57.6
   ],
   [
    -153,
    57.1
   ]
  ],
  [
   [
    -3,
    58.6
   ],
   [
    -4.1,
    57.5
   ],
   [
    -2,
    57.7
   ],
   [
    -3.1,
    56
   ],
   [
    -2.1,
    55.9
   ],
   [
    0.5,
    52.9
   ],
   [
    1.7,
    52.7
   ],
   [
    1.1,
    51.8
   ],
   [
    1.4,
    51.3
   ],
   [
    -5.2,
    50
   ],
   [
    -5.8,
    50.2
   ],
   [
    -3.4,
    51.4
   ],
   [
    -5.3,
    52
   ],
   [
    -4.2,
    52.3
   ],
   [
    -4.6,
    53.5
   ],
   [
    -3.1,
    53.4
   ],
   [
    -3,
    54
   ],
   [
    -4.8,
    54.8
   ],
   [
    -5,
    55.8
   ],
   [
    -5.6,
    55.3
   ],
   [
    -6.2,
    56.8
   ],
   [
    -5,
    58.6
   ],
   [
    -3,
    58.6
   ]
  ],
  [
   [
    -79.3,
    62.2
   ],
   [
    -79.7,
    61.6
   ],
   [
    -80.4,
    62
   ],
   [
    -79.3,
    62.2
   ]
  ],
  [
   [
    -85.2,
    65.7
   ],
   [
    -80.1,
    63.7
   ],
   [
    -83.1,
    64.1
   ],
   [
    -85.5,
    63
   ],
   [
    -85.9,
    63.6
   ],
   [
    -87.2,
    63.5
   ],
   [
    -86.3,
    64
   ],
   [
    -85.9,
    65.7
   ],
   [
    -85.2,
    65.7
   ]
  ],
  [
   [
    -14.5,
    66.5
   ],
   [
    -14.7,
    65.8
   ],
   [
    -13.6,
    65.1
   ],
   [
    -18.7,
    63.5
   ],
   [
    -22.8,
    64
   ],
   [
    -21.8,
    64.4
   ],
   [
    -24,
    64.9
   ],
   [
    -22.2,
    65.4
   ],
   [
    -24.3,
    65.6
   ],
   [
    -22.1,
    66.4
   ],
   [
    -20.6,
    65.7
   ],
   [
    -14.5,
    66.5
   ]
  ],
  [
   [
    -75.9,
    67.2
   ],
   [
    -77.2,
    67.6
   ],
   [
    -75.9,
    68.3
   ],
   [
    -75.1,
    67.6
   ],
   [
    -75.9,
    67.2
   ]
  ],
  [
   [
    -180,
    69
   ],
   [
    -174.9,
    67.2
   ],
   [
    -174.3,
    66.3
   ],
   [
    -174.6,
    67.1
   ],
   [
    -171.9,
    66.9
   ],
   [
    -169.9,
    66
   ],
   [
    -172.5,
    65.4
   ],
   [
    -172.9,
    64.2
   ],
   [
    -178.4,
    65.4
   ],
   [
    -178.7,
    66.1
   ],
   [
    -179.9,
    65.9
   ],
   [
    -179.4,
    65.4
   ],
   [
    -180,
    65
   ],
   [
    180,
    65
   ],
   [
    177.4,
    64.6
   ],
   [
    179.4,
    63
   ],
   [
    179.2,
    62.3
   ],
   [
    173.7,
    61.6
   ],
   [
    170.3,
    59.9
   ],
   [
    168.9,
    60.6
   ],
   [
    163.5,
    59.9
   ],
   [
    162,
    58.2
   ],
   [
    163.2,
    57.6
   ],
   [
    163.1,
    56.2
   ],
   [
    162.1,
    56.1
   ],
   [
    161.7,
    55.3
   ],
   [
    162.1,
    54.9
   ],
   [
    160.4,
    54.4
   ],
   [
    160,
    53.2
   ],
   [
    158.5,
    53
   ],
   [
    158.2,
    51.9
   ],
   [
    156.8,
    51
   ],
   [
    155.4,
    55.4
   ],
   [
    155.9,
    56.8
   ],
   [
    156.8,
    57.8
   ],
   [
    158.4,
    58.1
   ],
   [
    163.7,
    61.1
   ],
   [
    164.5,
    62.5
   ],
   [
    160.1,
    60.5
   ],
   [
    159.3,
    61.8
   ],
   [
    156.7,
    61.4
   ],
   [
    154.2,
    59.8
   ],
   [
    155,
    59.1
   ],
   [
    151.3,
    58.8
   ],
   [
    151.3,
    59.5
   ],
   [
    149.8,
    59.7
   ],
   [
    142.2,
    59
   ],
   [
    135.1,
    54.7
   ],
   [
    138.2,
    53.8
   ],
   [
    139.9,
    54.2
   ],
   [
    141.3,
    53.1
   ],
   [
    141.4,
    52.2
   ],
   [
    140.1,
    48.5
   ],
   [
    138.2,
    46.3
   ],
   [
    134.9,
    43.4
   ],
   [
    133.5,
    42.8
   ],
   [
    132.3,
    43.3
   ],
   [
    127.5,
    39.8
   ],
   [
    129.5,
    36.8
   ],
   [
    129.1,
    35.1
   ],
   [
    126.5,
    34.4
   ],
   [
    126.1,
    36.7
   ],
   [
    126.9,
    36.9
   ],
   [
    124.7,
    38.1
   ],
   [
    125.3,
    39.5
   ],
   [
    124.3,
    39.9
   ],
   [
    121,
    38.9
   ],
   [
    122.2,
    40.4
   ],
   [
    121.6,
    41
   ],
   [
    118,
    39.2
   ],
   [
    117.5,
    38.7
   ],
   [
    118.9,
    37.5
   ],
   [
    122.4,
    37.5
   ],
   [
    122.5,
    36.9
   ],
   [
    121.1,
    36.6
   ],
   [
    119.2,
    34.9
   ],
   [
    120.2,
    34.4
   ],
   [
    121.9,
    31.7
   ],
   [
    121.3,
    30.7
   ],
   [
    122.1,
    29.8
   ],
   [
    121.7,
    28.2
   ],
   [
    118.7,
    24.6
   ],
   [
    115.9,
    22.8
   ],
   [
    110.8,
    21.4
   ],
   [
    110.4,
    20.3
   ],
   [
    109.9,
    20.3
   ],
   [
    109.9,
    21.4
   ],
   [
    108.5,
    21.7
   ],
   [
    105.9,
    19.8
   ],
   [
    105.7,
    19.1
   ],
   [
    108.9,
    15.3
   ],
   [
    109.3,
    13.4
   ],
   [
    109.2,
    11.7
   ],
   [
    105.2,
    8.6
   ],
   [
    105.1,
    9.9
   ],
   [
    103.5,
    10.6
   ],
   [
    102.6,
    12.2
   ],
   [
    100.8,
    12.6
   ],
   [
    101,
    13.4
   ],
   [
    100.1,
    13.4
   ],
   [
    99.2,
    9.2
   ],
   [
    103,
    5.5
   ],
   [
    104.2,
    1.3
   ],
   [
    101.4,
    2.8
   ],
   [
    100.1,
    6.5
   ],
   [
    98.5,
    8.4
   ],
   [
    98.3,
    7.8
   ],
   [
    98.8,
    11.4
   ],
   [
    97.2,
    16.9
   ],
   [
    95.4,
    15.7
   ],
   [
    94.2,
    16
   ],
   [
    94.3,
    18.2
   ],
   [
    91.4,
    22.8
   ],
   [
    90.5,
    22.8
   ],
   [
    90.3,
    21.8
   ],
   [
    87,
    21.5
   ],
   [
    86.5,
    20.1
   ],
   [
    82.2,
    16.6
   ],
   [
    80.3,
    15.9
   ],
   [
    79.9,
    10.4
   ],
   [
    77.5,
    8
   ],
   [
    73.5,
    16
   ],
   [
    72.6,
    21.4
   ],
   [
    70.5,
    20.9
   ],
   [
    69.2,
    22.1
   ],
   [
    69.3,
    22.8
   ],
   [
    66.4,
    25.4
   ],
   [
    61.5,
    25.1
   ],
   [
    57.4,
    25.7
   ],
   [
    57,
    27
   ],
   [
    54.7,
    26.5
   ],
   [
    51.5,
    27.9
   ],
   [
    50.1,
    30.1
   ],
   [
    48,
    30
   ],
   [
    50.8,
    24.8
   ],
   [
    51,
    26
   ],
   [
    51.6,
    25.8
   ],
   [
    51.8,
    24
   ],
   [
    54,
    24.1
   ],
   [
    56.4,
    26.4
   ],
   [
    56.9,
    24.2
   ],
   [
    58.7,
    23.6
   ],
   [
    59.8,
    22.3
   ],
   [
    57.8,
    20.2
   ],
   [
    57.7,
    18.9
   ],
   [
    55.3,
    17.2
   ],
   [
    52.4,
    16.4
   ],
   [
    52.2,
    15.6
   ],
   [
    48.7,
    14
   ],
   [
    43.5,
    12.6
   ],
   [
    42.6,
    16.8
   ],
   [
    39.1,
    21.3
   ],
   [
    38.5,
    23.7
   ],
   [
    34.6,
    28.1
   ],
   [
    34.9,
    29.5
   ],
   [
    33.9,
    27.6
   ],
   [
    32.4,
    29.9
   ],
   [
    35.7,
    23.9
   ],
   [
    35.5,
    23.1
   ],
   [
    36.9,
    22
   ],
   [
    37.5,
    18.6
   ],
   [
    39.3,
    15.9
   ],
   [
    43.3,
    12.4
   ],
   [
    42.7,
    11.7
   ],
   [
    44.6,
    10.4
   ],
   [
    51.1,
    12
   ],
   [
    51,
    10.6
   ],
   [
    47.7,
    4.2
   ],
   [
    40.3,
    -2.6
   ],
   [
    39.2,
    -4.7
   ],
   [
    38.8,
    -6.5
   ],
   [
    39.4,
    -6.8
   ],
   [
    39.2,
    -8.5
   ],
   [
    40.5,
    -10.8
   ],
   [
    40.8,
    -14.7
   ],
   [
    39.5,
    -16.7
   ],
   [
    34.8,
    -19.8
   ],
   [
    35.5,
    -24.1
   ],
   [
    32.6,
    -25.7
   ],
   [
    32.2,
    -28.8
   ],
   [
    28.2,
    -32.8
   ],
   [
    25.8,
    -34
   ],
   [
    22.6,
    -33.9
   ],
   [
    19.6,
    -34.8
   ],
   [
    18.2,
    -33.9
   ],
   [
    18.2,
    -31.7
   ],
   [
    15.2,
    -27.1
   ],
   [
    14.3,
    -22.1
   ],
   [
    11.8,
    -18.1
   ],
   [
    11.8,
    -15.8
   ],
   [
    13.7,
    -10.7
   ],
   [
    11.9,
    -5
   ],
   [
    8.8,
    -1.1
   ],
   [
    9.8,
    3.1
   ],
   [
    9.4,
    3.7
   ],
   [
    8.5,
    4.8
   ],
   [
    5.9,
    4.3
   ],
   [
    4.3,
    6.3
   ],
   [
    1.9,
    6.1
   ],
   [
    -2,
    4.7
   ],
   [
    -4.7,
    5.2
   ],
   [
    -7.5,
    4.3
   ],
   [
    -9,
    4.8
   ],
   [
    -12.4,
    7.3
   ],
   [
    -14.8,
    10.9
   ],
   [
    -16.6,
    12.2
   ],
   [
    -17.6,
    14.7
   ],
   [
    -16.5,
    16.1
   ],
   [
    -16.1,
    18.1
   ],
   [
    -17,
    21.9
   ],
   [
    -14.4,
    26.2
   ],
   [
    -9.6,
    29.9
   ],
   [
    -9.3,
    32.6
   ],
   [
    -6.9,
    34.1
   ],
   [
    -5.9,
    35.8
   ],
   [
    -2.2,
    35.2
   ],
   [
    1.5,
    36.6
   ],
   [
    9.5,
    37.4
   ],
   [
    11.1,
    36.9
   ],
   [
    10.3,
    33.8
   ],
   [
    19.1,
    30.3
   ],
   [
    20.1,
    31
   ],
   [
    20.1,
    32.2
   ],
   [
    21.5,
    32.8
   ],
   [
    28.9,
    30.9
   ],
   [
    31,
    31.6
   ],
   [
    33.8,
    31
   ],
   [
    36,
    34.6
   ],
   [
    36.2,
    36.6
   ],
   [
    32.5,
    36.1
   ],
   [
    27.6,
    36.7
   ],
   [
    26.2,
    39.5
   ],
   [
    27.3,
    40.4
   ],
   [
    28.8,
    40.5
   ],
   [
    29.2,
    41.2
   ],
   [
    31.1,
    41.1
   ],
   [
    33.5,
    42
   ],
   [
    38.4,
    41
   ],
   [
    40.4,
    41
   ],
   [
    41.7,
    42
   ],
   [
    36.7,
    45.2
   ],
   [
    39.1,
    47.3
   ],
   [
    35,
    46.3
   ],
   [
    36.3,
    45.1
   ],
   [
    33.9,
    44.4
   ],
   [
    32.5,
    45.3
   ],
   [
    33.3,
    46.1
   ],
   [
    30.8,
    46.6
   ],
   [
    28.8,
    44.9
   ],
   [
    27.7,
    42.6
   ],
   [
    28.8,
    41.1
   ],
   [
    26.4,
    40.1
   ],
   [
    24.9,
    41
   ],
   [
    23.7,
    40.7
   ],
   [
    24.4,
    40.1
   ],
   [
    23.9,
    40
   ],
   [
    22.6,
    40.3
   ],
   [
    24,
    37.6
   ],
   [
    23.1,
    37.9
   ],
   [
    23.1,
    36.4
   ],
   [
    22.5,
    36.4
   ],
   [
    19.4,
    40.2
   ],
   [
    19.5,
    41.7
   ],
   [
    13.1,
    45.7
   ],
   [
    12.3,
    45.4
   ],
   [
    12.6,
    44.1
   ],
   [
    18.5,
    40.2
   ],
   [
    16.9,
    40.4
   ],
   [
    16.4,
    39.8
   ],
   [
    17.1,
    38.9
   ],
   [
    16.1,
    38
   ],
   [
    15.4,
    40
   ],
   [
    8.9,
    44.4
   ],
   [
    6.5,
    43.1
   ],
   [
    3.1,
    43.1
   ],
   [
    3,
    41.9
   ],
   [
    0.8,
    41
   ],
   [
    -0.3,
    39.3
   ],
   [
    0.1,
    38.7
   ],
   [
    -2.1,
    36.7
   ],
   [
    -4.4,
    36.7
   ],
   [
    -5.4,
    36
   ],
   [
    -6.5,
    36.9
   ],
   [
    -8.9,
    36.9
   ],
   [
    -8.8,
    38.3
   ],
   [
    -9.5,
    38.7
   ],
   [
    -8.8,
    40.8
   ],
   [
    -9.4,
    43
   ],
   [
    -8,
    43.8
   ],
   [
    -1.9,
    43.4
   ],
   [
    -1.4,
    44
   ],
   [
    -1.2,
    46
   ],
   [
    -4.5,
    48
   ],
   [
    -4.6,
    48.7
   ],
   [
    -1.6,
    48.6
   ],
   [
    -1.9,
    49.8
   ],
   [
    -1,
    49.4
   ],
   [
    1.3,
    50.1
   ],
   [
    1.6,
    51
   ],
   [
    3.8,
    51.6
   ],
   [
    4.7,
    53.1
   ],
   [
    8.1,
    53.5
   ],
   [
    8.8,
    54
   ],
   [
    8.1,
    55.5
   ],
   [
    8.5,
    57.1
   ],
   [
    10.6,
    57.7
   ],
   [
    10.2,
    56.9
   ],
   [
    10.9,
    56.5
   ],
   [
    9.7,
    55.5
   ],
   [
    10.9,
    54
   ],
   [
    12.5,
    54.5
   ],
   [
    14.1,
    53.8
   ],
   [
    17.6,
    54.9
   ],
   [
    19.7,
    54.4
   ],
   [
    21.3,
    55.2
   ],
   [
    21.6,
    57.4
   ],
   [
    22.5,
    57.8
   ],
   [
    24.1,
    57
   ],
   [
    24.4,
    58.4
   ],
   [
    23.3,
    59.2
   ],
   [
    29.1,
    60
   ],
   [
    28.1,
    60.5
   ],
   [
    22.9,
    59.9
   ],
   [
    21.3,
    60.7
   ],
   [
    21.5,
    63.2
   ],
   [
    25.4,
    65.1
   ],
   [
    23.9,
    66
   ],
   [
    22.2,
    65.7
   ],
   [
    21.2,
    65
   ],
   [
    21.4,
    64.4
   ],
   [
    17.9,
    62.8
   ],
   [
    17.1,
    61.3
   ],
   [
    18.8,
    60.1
   ],
   [
    16.8,
    58.7
   ],
   [
    15.9,
    56.1
   ],
   [
    12.9,
    55.4
   ],
   [
    10.4,
    59.5
   ],
   [
    8.4,
    58.3
   ],
   [
    5.7,
    58.6
   ],
   [
    5,
    62
   ],
   [
    5.9,
    62.6
   ],
   [
    10.5,
    64.5
   ],
   [
    14.8,
    67.8
   ],
   [
    19.2,
    69.8
   ],
   [
    23,
    70.2
   ],
   [
    24.6,
    71
   ],
   [
    28.2,
    71.2
   ],
   [
    31.3,
    70.5
   ],
   [
    30,
    70.2
   ],
   [
    31.1,
    69.6
   ],
   [
    32.1,
    69.9
   ],
   [
    40.3,
    67.9
   ],
   [
    41.1,
    66.8
   ],
   [
    40,
    66.3
   ],
   [
    33.2,
    66.6
   ],
   [
    34.8,
    65.9
   ],
   [
    34.9,
    64.4
   ],
   [
    37,
    63.9
   ],
   [
    36.5,
    64.8
   ],
   [
    37.2,
    65.1
   ],
   [
    39.6,
    64.5
   ],
   [
    40.4,
    64.8
   ],
   [
    39.8,
    65.5
   ],
   [
    42.1,
    66.5
   ],
   [
    44,
    66.1
   ],
   [
    44.5,
    66.8
   ],
   [
    43.5,
    68.6
   ],
   [
    46.2,
    68.2
   ],
   [
    46.8,
    67.7
   ],
   [
    45.6,
    67.6
   ],
   [
    45.6,
    67
   ],
   [
    46.4,
    66.7
   ],
   [
    53.7,
    68.9
   ],
   [
    54.5,
    68.8
   ],
   [
    53.5,
    68.2
   ],
   [
    58.8,
    68.9
   ],
   [
    59.9,
    68.3
   ],
   [
    61.1,
    68.9
   ],
   [
    60,
    69.5
   ],
   [
    60.5,
    69.8
   ],
   [
    68.5,
    68.1
   ],
   [
    69.2,
    68.6
   ],
   [
    66.9,
    69.5
   ],
   [
    66.7,
    71
   ],
   [
    69.2,
    72.8
   ],
   [
    72.6,
    72.8
   ],
   [
    71.8,
    71.4
   ],
   [
    72.8,
    70.4
   ],
   [
    72.6,
    69
   ],
   [
    73.7,
    68.4
   ],
   [
    71.3,
    66.3
   ],
   [
    72.4,
    66.2
   ],
   [
    75,
    67.8
   ],
   [
    74.5,
    68.3
   ],
   [
    74.9,
    69
   ],
   [
    73.6,
    69.6
   ],
   [
    74.4,
    70.6
   ],
   [
    73.1,
    71.5
   ],
   [
    74.9,
    72.1
   ],
   [
    74.7,
    72.8
   ],
   [
    75.7,
    72.3
   ],
   [
    75.3,
    71.3
   ],
   [
    76.4,
    71.2
   ],
   [
    75.9,
    71.9
   ],
   [
    77.6,
    72.3
   ],
   [
    81.5,
    71.8
   ],
   [
    80.5,
    73.7
   ],
   [
    86.8,
    73.9
   ],
   [
    86,
    74.5
   ],
   [
    87.2,
    75.1
   ],
   [
    100.8,
    76.4
   ],
   [
    104.3,
    77.7
   ],
   [
    107.2,
    76.5
   ],
   [
    111.1,
    76.7
   ],
   [
    114.1,
    75.8
   ],
   [
    109.4,
    74.2
   ],
   [
    113,
    74
   ],
   [
    113.5,
    73.3
   ],
   [
    115.6,
    73.8
   ],
   [
    123.2,
    73
   ],
   [
    123.3,
    73.7
   ],
   [
    127,
    73.6
   ],
   [
    128.6,
    73
   ],
   [
    129.1,
    72.4
   ],
   [
    128.5,
    72
   ],
   [
    131.3,
    70.8
   ],
   [
    132.2,
    71.8
   ],
   [
    139.9,
    71.5
   ],
   [
    139.2,
    72.4
   ],
   [
    140.5,
    72.8
   ],
   [
    149.5,
    72.2
   ],
   [
    153,
    70.8
   ],
   [
    159,
    70.9
   ],
   [
    159.8,
    70.5
   ],
   [
    159.7,
    69.7
   ],
   [
    160.9,
    69.4
   ],
   [
    167.8,
    69.6
   ],
   [
    169.6,
    68.7
   ],
   [
    170.8,
    69
   ],
   [
    170,
    69.7
   ],
   [
    170.4,
    70.1
   ],
   [
    178.6,
    69.4
   ],
   [
    -180,
    69
   ]
  ],
  [
   [
    -95.7,
    69.1
   ],
   [
    -99.8,
    69.4
   ],
   [
    -98.2,
    70.1
   ],
   [
    -95.7,
    69.1
   ]
  ],
  [
   [
    -180,
    71.5
   ],
   [
    -177.6,
    71.3
   ],
   [
    -180,
    70.8
   ],
   [
    -180,
    71.5
   ]
  ],
  [
   [
    -90.5,
    69.5
   ],
   [
    -90.5,
    68.5
   ],
   [
    -89.2,
    69.3
   ],
   [
    -88,
    68.6
   ],
   [
    -88.3,
    67.9
   ],
   [
    -87.3,
    67.2
   ],
   [
    -85.6,
    68.8
   ],
   [
    -85.5,
    69.9
   ],
   [
    -82.6,
    69.7
   ],
   [
    -81.3,
    69.2
   ],
   [
    -82,
    68.1
   ],
   [
    -81.3,
    67.6
   ],
   [
    -83.3,
    66.4
   ],
   [
    -85.8,
    66.6
   ],
   [
    -87.3,
    64.8
   ],
   [
    -93.2,
    62
   ],
   [
    -94.2,
    60.9
   ],
   [
    -94.7,
    59
   ],
   [
    -93.2,
    58.8
   ],
   [
    -92.3,
    57.1
   ],
   [
    -90.9,
    57.3
   ],
   [
    -85,
    55.3
   ],
   [
    -82.3,
    55.1
   ],
   [
    -82.1,
    53.3
   ],
   [
    -79.9,
    51.2
   ],
   [
    -78.6,
    52.6
   ],
   [
    -79.8,
    54.7
   ],
   [
    -76.5,
    56.5
   ],
   [
    -78.5,
    58.8
   ],
   [
    -77.3,
    59.9
   ],
   [
    -78.1,
    62.3
   ],
   [
    -73.8,
    62.4
   ],
   [
    -71.4,
    61.1
   ],
   [
    -69.6,
    61.1
   ],
   [
    -69.3,
    59
   ],
   [
    -67.7,
    58.2
   ],
   [
    -64.6,
    60.3
   ],
   [
    -61.4,
    57
   ],
   [
    -61.8,
    56.3
   ],
   [
    -57.3,
    54.6
   ],
   [
    -55.8,
    53.3
   ],
   [
    -55.7,
    52.1
   ],
   [
    -60,
    50.2
   ],
   [
    -66.4,
    50.2
   ],
   [
    -71.1,
    46.8
   ],
   [
    -68.7,
    48.3
   ],
   [
    -65,
    49.2
   ],
   [
    -64.2,
    48.7
   ],
   [
    -65.1,
    48.1
   ],
   [
    -64.5,
    46.2
   ],
   [
    -61.5,
    45.9
   ],
   [
    -60.5,
    47
   ],
   [
    -59.8,
    45.9
   ],
   [
    -65.4,
    43.5
   ],
   [
    -66.1,
    43.6
   ],
   [
    -66.2,
    44.5
   ],
   [
    -64.4,
    45.3
   ],
   [
    -67.1,
    45.1
   ],
   [
    -70.7,
    43
   ],
   [
    -70,
    41.6
   ],
   [
    -73.7,
    40.9
   ],
   [
    -71.9,
    40.9
   ],
   [
    -74,
    40.8
   ],
   [
    -74.9,
    38.9
   ],
   [
    -75.5,
    39.5
   ],
   [
    -75.1,
    38.4
   ],
   [
    -75.9,
    37.2
   ],
   [
    -76.3,
    39.1
   ],
   [
    -76.3,
    38.1
   ],
   [
    -77,
    38.2
   ],
   [
    -76.3,
    37.9
   ],
   [
    -75.7,
    35.5
   ],
   [
    -81.3,
    31.4
   ],
   [
    -80.1,
    26.9
   ],
   [
    -80.4,
    25.2
   ],
   [
    -81.7,
    25.9
   ],
   [
    -82.9,
    29.1
   ],
   [
    -84.1,
    30.1
   ],
   [
    -85.1,
    29.6
   ],
   [
    -86.4,
    30.4
   ],
   [
    -89.2,
    30.3
   ],
   [
    -89.2,
    29.3
   ],
   [
    -90.2,
    29.1
   ],
   [
    -93.8,
    29.7
   ],
   [
    -96.6,
    28.3
   ],
   [
    -97.4,
    27.4
   ],
   [
    -97.9,
    22.4
   ],
   [
    -96.3,
    19.3
   ],
   [
    -94.4,
    18.1
   ],
   [
    -92,
    18.7
   ],
   [
    -90.8,
    19.3
   ],
   [
    -90.3,
    21
   ],
   [
    -87,
    21.5
   ],
   [
    -88.9,
    15.9
   ],
   [
    -85,
    16
   ],
   [
    -83.4,
    15.3
   ],
   [
    -83.8,
    11.1
   ],
   [
    -81.4,
    8.8
   ],
   [
    -79.6,
    9.6
   ],
   [
    -76.8,
    8.6
   ],
   [
    -74.9,
    11.1
   ],
   [
    -73.4,
    11.2
   ],
   [
    -71.8,
    12.4
   ],
   [
    -71.1,
    12.1
   ],
   [
    -72,
    11.4
   ],
   [
    -71.7,
    9.1
   ],
   [
    -71,
    9.9
   ],
   [
    -71.4,
    11
   ],
   [
    -70.2,
    11.4
   ],
   [
    -69.9,
    12.2
   ],
   [
    -68.2,
    10.6
   ],
   [
    -64.9,
    10.1
   ],
   [
    -61.9,
    10.7
   ],
   [
    -62.7,
    10.4
   ],
   [
    -62.4,
    9.9
   ],
   [
    -60.8,
    9.4
   ],
   [
    -60.7,
    8.6
   ],
   [
    -59.1,
    8
   ],
   [
    -57.1,
    6
   ],
   [
    -54,
    5.8
   ],
   [
    -51.3,
    4.2
   ],
   [
    -50,
    1.7
   ],
   [
    -50.4,
    -0.1
   ],
   [
    -48.6,
    -0.2
   ],
   [
    -48.6,
    -1.2
   ],
   [
    -47.8,
    -0.6
   ],
   [
    -44.9,
    -1.6
   ],
   [
    -44.6,
    -2.7
   ],
   [
    -40,
    -2.9
   ],
   [
    -37.2,
    -4.8
   ],
   [
    -35.6,
    -5.2
   ],
   [
    -34.7,
    -7.3
   ],
   [
    -35.1,
    -9
   ],
   [
    -38.7,
    -13.1
   ],
   [
    -39.3,
    -17.9
   ],
   [
    -41,
    -21.9
   ],
   [
    -42,
    -23
   ],
   [
    -44.6,
    -23.4
   ],
   [
    -47.6,
    -24.9
   ],
   [
    -48.5,
    -25.9
   ],
   [
    -48.9,
    -28.7
   ],
   [
    -53.8,
    -34.4
   ],
   [
    -56.2,
    -34.9
   ],
   [
    -58.4,
    -33.9
   ],
   [
    -56.8,
    -36.9
   ],
   [
    -57.8,
    -38.2
   ],
   [
    -59.2,
    -38.7
   ],
   [
    -62.3,
    -38.8
   ],
   [
    -62.1,
    -40.7
   ],
   [
    -62.8,
    -41
   ],
   [
    -65.1,
    -41.1
   ],
   [
    -65,
    -42.1
   ],
   [
    -63.5,
    -42.6
   ],
   [
    -65.2,
    -43.5
   ],
   [
    -65.6,
    -45
   ],
   [
    -67.3,
    -45.5
   ],
   [
    -67.6,
    -46.3
   ],
   [
    -65.6,
    -47.2
   ],
   [
    -66,
    -48.1
   ],
   [
    -69.1,
    -50.7
   ],
   [
    -68.2,
    -52.4
   ],
   [
    -70.8,
    -52.9
   ],
   [
    -71,
    -53.8
   ],
   [
    -75,
    -52.3
   ],
   [
    -75.6,
    -48.7
   ],
   [
    -74.1,
    -46.9
   ],
   [
    -75.7,
    -46.6
   ],
   [
    -74.7,
    -45.8
   ],
   [
    -74.3,
    -44.1
   ],
   [
    -73.2,
    -44.5
   ],
   [
    -72.7,
    -42.4
   ],
   [
    -73.4,
    -42.1
   ],
   [
    -73.7,
    -43.4
   ],
   [
    -74.3,
    -43.2
   ],
   [
    -73.2,
    -39.3
   ],
   [
    -73.6,
    -37.2
   ],
   [
    -71.4,
    -32.4
   ],
   [
    -70.2,
    -19.8
   ],
   [
    -70.4,
    -18.4
   ],
   [
    -71.5,
    -17.4
   ],
   [
    -76,
    -14.7
   ],
   [
    -79.8,
    -7.2
   ],
   [
    -81.2,
    -6.1
   ],
   [
    -81.4,
    -4.7
   ],
   [
    -79.8,
    -2.7
   ],
   [
    -81,
    -2.2
   ],
   [
    -80.9,
    -1.1
   ],
   [
    -80.1,
    0.8
   ],
   [
    -78.9,
    1.4
   ],
   [
    -77.1,
    3.9
   ],
   [
    -78.2,
    8.3
   ],
   [
    -79.6,
    8.9
   ],
   [
    -80.5,
    8.1
   ],
   [
    -80,
    7.5
   ],
   [
    -80.9,
    7.2
   ],
   [
    -81.1,
    7.8
   ],
   [
    -83.5,
    8.4
   ],
   [
    -85,
    10.1
   ],
   [
    -85.1,
    9.6
   ],
   [
    -85.7,
    9.9
   ],
   [
    -85.7,
    11.1
   ],
   [
    -87.5,
    13.3
   ],
   [
    -91.2,
    13.9
   ],
   [
    -94.7,
    16.2
   ],
   [
    -96.6,
    15.7
   ],
   [
    -103.5,
    18.3
   ],
   [
    -105.5,
    19.9
   ],
   [
    -105.3,
    21.4
   ],
   [
    -106,
    22.8
   ],
   [
    -109.3,
    25.6
   ],
   [
    -109.3,
    26.4
   ],
   [
    -112.2,
    29
   ],
   [
    -113.9,
    31.6
   ],
   [
    -114.8,
    31.8
   ],
   [
    -114.7,
    30.2
   ],
   [
    -109.4,
    23.4
   ],
   [
    -110,
    22.8
   ],
   [
    -112.2,
    24.7
   ],
   [
    -112.3,
    26
   ],
   [
    -115.1,
    27.7
   ],
   [
    -114.2,
    28.6
   ],
   [
    -115.5,
    29.6
   ],
   [
    -117.3,
    33
   ],
   [
    -120.6,
    34.6
   ],
   [
    -124.4,
    40.3
   ],
   [
    -123.9,
    45.5
   ],
   [
    -124.7,
    48.2
   ],
   [
    -123.1,
    48
   ],
   [
    -122.6,
    47.1
   ],
   [
    -122.8,
    49
   ],
   [
    -127.4,
    50.8
   ],
   [
    -127.8,
    52.3
   ],
   [
    -129.1,
    52.8
   ],
   [
    -134.1,
    58.1
   ],
   [
    -147.1,
    60.9
   ],
   [
    -148.2,
    60.7
   ],
   [
    -148,
    60
   ],
   [
    -151.7,
    59.2
   ],
   [
    -151.4,
    60.7
   ],
   [
    -150.6,
    61.3
   ],
   [
    -154,
    59.4
   ],
   [
    -153.3,
    58.9
   ],
   [
    -154.2,
    58.1
   ],
   [
    -158.4,
    56
   ],
   [
    -164.8,
    54.4
   ],
   [
    -157.7,
    57.6
   ],
   [
    -157,
    58.9
   ],
   [
    -162,
    58.7
   ],
   [
    -161.9,
    59.6
   ],
   [
    -163.8,
    59.8
   ],
   [
    -166.1,
    61.5
   ],
   [
    -164.6,
    63.1
   ],
   [
    -160.8,
    63.8
   ],
   [
    -161.5,
    64.4
   ],
   [
    -160.8,
    64.8
   ],
   [
    -165,
    64.5
   ],
   [
    -168.1,
    65.7
   ],
   [
    -164.5,
    66.6
   ],
   [
    -161.7,
    66.1
   ],
   [
    -166.8,
    68.4
   ],
   [
    -161.9,
    70.3
   ],
   [
    -156.6,
    71.4
   ],
   [
    -136.5,
    68.9
   ],
   [
    -129.8,
    70.2
   ],
   [
    -129.1,
    69.8
   ],
   [
    -128.1,
    70.5
   ],
   [
    -125.8,
    69.5
   ],
   [
    -124.4,
    70.2
   ],
   [
    -124.3,
    69.4
   ],
   [
    -121.5,
    69.8
   ],
   [
    -115.2,
    68.9
   ],
   [
    -113.9,
    68.4
   ],
   [
    -115.3,
    67.9
   ],
   [
    -110,
    68
   ],
   [
    -108.9,
    67.4
   ],
   [
    -107.8,
    67.9
   ],
   [
    -108.8,
    68.3
   ],
   [
    -108.2,
    68.7
   ],
   [
    -106.2,
    68.8
   ],
   [
    -101.5,
    67.7
   ],
   [
    -98.4,
    67.8
   ],
   [
    -98.6,
    68.4
   ],
   [
    -97.7,
    68.6
   ],
   [
    -96.1,
    68.2
   ],
   [
    -96.1,
    67.3
   ],
   [
    -94.2,
    69.1
   ],
   [
    -96.5,
    70.1
   ],
   [
    -96.4,
    71.2
   ],
   [
    -95.2,
    71.9
   ],
   [
    -92.9,
    71.3
   ],
   [
    -91.5,
    70.2
   ],
   [
    -92.4,
    69.7
   ],
   [
    -90.5,
    69.5
   ]
  ],
  [
   [
    -114.2,
    73.1
   ],
   [
    -114.7,
    72.7
   ],
   [
    -111,
    72.5
   ],
   [
    -109.9,
    73
   ],
   [
    -108.2,
    71.7
   ],
   [
    -107.7,
    72.1
   ],
   [
    -108.4,
    73.1
   ],
   [
    -106.5,
    73.1
   ],
   [
    -105.4,
    72.7
   ],
   [
    -104.5,
    71
   ],
   [
    -101.1,
    69.6
   ],
   [
    -102.7,
    69.5
   ],
   [
    -102.1,
    69.1
   ],
   [
    -102.4,
    68.8
   ],
   [
    -106,
    69.2
   ],
   [
    -113.3,
    68.5
   ],
   [
    -116.1,
    69.2
   ],
   [
    -117.3,
    70
   ],
   [
    -112.4,
    70.4
   ],
   [
    -117.9,
    70.5
   ],
   [
    -118.4,
    70.9
   ],
   [
    -116.1,
    71.3
   ],
   [
    -119.4,
    71.6
   ],
   [
    -117.9,
    72.7
   ],
   [
    -114.2,
    73.1
   ]
  ],
  [
   [
    -104.5,
    73.4
   ],
   [
    -105.4,
    72.8
   ],
   [
    -106.9,
    73.5
   ],
   [
    -104.5,
    73.4
   ]
  ],
  [
   [
    -76.3,
    73.1
   ],
   [
    -79.5,
    72.7
   ],
   [
    -80.9,
    73.3
   ],
   [
    -78.1,
    73.7
   ],
   [
    -76.3,
    73.1
   ]
  ],
  [
   [
    -86.6,
    73.2
   ],
   [
    -85.8,
    72.5
   ],
   [
    -84.8,
    73.3
   ],
   [
    -82.3,
    73.8
   ],
   [
    -80.6,
    72.7
   ],
   [
    -80.8,
    72.1
   ],
   [
    -77.8,
    72.8
   ],
   [
    -74.1,
    71.3
   ],
   [
    -72.2,
    71.6
   ],
   [
    -67.9,
    70.1
   ],
   [
    -67,
    69.2
   ],
   [
    -68.8,
    68.7
   ],
   [
    -61.9,
    66.9
   ],
   [
    -63.9,
    65
   ],
   [
    -66.7,
    66.4
   ],
   [
    -68,
    66.3
   ],
   [
    -68.1,
    65.7
   ],
   [
    -65.3,
    64.4
   ],
   [
    -64.7,
    63.4
   ],
   [
    -65,
    62.7
   ],
   [
    -68.8,
    63.8
   ],
   [
    -66.2,
    61.9
   ],
   [
    -71,
    62.9
   ],
   [
    -74.8,
    64.7
   ],
   [
    -77.7,
    64.2
   ],
   [
    -78.5,
    64.6
   ],
   [
    -77.9,
    65.3
   ],
   [
    -74,
    65.5
   ],
   [
    -72.9,
    67.7
   ],
   [
    -79,
    70.2
   ],
   [
    -81.3,
    69.7
   ],
   [
    -88.7,
    70.4
   ],
   [
    -89.5,
    70.8
   ],
   [
    -88.5,
    71.2
   ],
   [
    -89.9,
    71.2
   ],
   [
    -90.2,
    72.2
   ],
   [
    -88.4,
    73.5
   ],
   [
    -85.8,
    73.8
   ],
   [
    -86.6,
    73.2
   ]
  ],
  [
   [
    -100.4,
    73.8
   ],
   [
    -97.4,
    73.8
   ],
   [
    -98,
    73
   ],
   [
    -96.5,
    72.6
   ],
   [
    -96.7,
    71.7
   ],
   [
    -99.3,
    71.4
   ],
   [
    -102.5,
    72.5
   ],
   [
    -100.4,
    72.7
   ],
   [
    -101.5,
    73.4
   ],
   [
    -100.4,
    73.8
   ]
  ],
  [
   [
    143.6,
    73.2
   ],
   [
    139.9,
    73.4
   ],
   [
    142.1,
    73.9
   ],
   [
    143.6,
    73.2
   ]
  ],
  [
   [
    -93.2,
    72.8
   ],
   [
    -95.4,
    72.1
   ],
   [
    -96,
    72.9
   ],
   [
    -95.5,
    73.9
   ],
   [
    -90.5,
    73.9
   ],
   [
    -93.2,
    72.8
   ]
  ],
  [
   [
    -120.5,
    71.4
   ],
   [
    -123.1,
    70.9
   ],
   [
    -125.9,
    71.9
   ],
   [
    -123.9,
    73.7
   ],
   [
    -124.9,
    74.3
   ],
   [
    -117.6,
    74.2
   ],
   [
    -115.5,
    73.5
   ],
   [
    -119.2,
    72.5
   ],
   [
    -120.5,
    71.4
   ]
  ],
  [
   [
    -93.6,
    75
   ],
   [
    -96.8,
    74.9
   ],
   [
    -94.8,
    75.7
   ],
   [
    -93.6,
    75
   ]
  ],
  [
   [
    145.1,
    75.6
   ],
   [
    144.3,
    74.8
   ],
   [
    139,
    74.6
   ],
   [
    137,
    75.3
   ],
   [
    138.8,
    76.1
   ],
   [
    145.1,
    75.6
   ]
  ],
  [
   [
    -98.5,
    76.7
   ],
   [
    -97.7,
    76.3
   ],
   [
    -98.2,
    75
   ],
   [
    -102.5,
    75.6
   ],
   [
    -102.6,
    76.3
   ],
   [
    -98.5,
    76.7
   ]
  ],
  [
   [
    -108.2,
    76.2
   ],
   [
    -105.9,
    76
   ],
   [
    -106.3,
    75
   ],
   [
    -113.7,
    74.4
   ],
   [
    -111.8,
    75.2
   ],
   [
    -117.7,
    75.2
   ],
   [
    -115.4,
    76.5
   ],
   [
    -109.1,
    75.5
   ],
   [
    -110.5,
    76.4
   ],
   [
    -109.6,
    76.8
   ],
   [
    -108.2,
    76.2
   ]
  ],
  [
   [
    57.5,
    70.7
   ],
   [
    51.6,
    71.5
   ],
   [
    52.4,
    72.8
   ],
   [
    54.4,
    73.6
   ],
   [
    53.5,
    73.8
   ],
   [
    55.9,
    74.6
   ],
   [
    55.6,
    75.1
   ],
   [
    66.2,
    76.8
   ],
   [
    68.8,
    76.5
   ],
   [
    58.5,
    74.3
   ],
   [
    55.4,
    72.4
   ],
   [
    55.6,
    71.5
   ],
   [
    57.5,
    70.7
   ]
  ],
  [
   [
    -94.7,
    77.1
   ],
   [
    -91.6,
    76.8
   ],
   [
    -89.2,
    75.6
   ],
   [
    -81.1,
    75.7
   ],
   [
    -79.8,
    74.9
   ],
   [
    -88.2,
    74.4
   ],
   [
    -92.4,
    74.8
   ],
   [
    -93.9,
    76.3
   ],
   [
    -97.1,
    76.8
   ],
   [
    -94.7,
    77.1
   ]
  ],
  [
   [
    -116.2,
    77.7
   ],
   [
    -117.1,
    76.5
   ],
   [
    -122.9,
    76.1
   ],
   [
    -119.1,
    77.5
   ],
   [
    -116.2,
    77.7
   ]
  ],
  [
   [
    24.7,
    77.8
   ],
   [
    20.7,
    77.7
   ],
   [
    21.4,
    77.9
   ],
   [
    20.8,
    78.2
   ],
   [
    22.9,
    78.5
   ],
   [
    24.7,
    77.8
   ]
  ],
  [
   [
    -95.8,
    78.1
   ],
   [
    -98.1,
    78.1
   ],
   [
    -98.6,
    78.9
   ],
   [
    -95.8,
    78.1
   ]
  ],
  [
   [
    -100.1,
    78.3
   ],
   [
    -105.2,
    78.4
   ],
   [
    -104.2,
    78.7
   ],
   [
    -105.5,
    79.3
   ],
   [
    -100.1,
    78.3
   ]
  ],
  [
   [
    105.1,
    78.3
   ],
   [
    99.4,
    77.9
   ],
   [
    102.1,
    79.3
   ],
   [
    105.4,
    78.7
   ],
   [
    105.1,
    78.3
   ]
  ],
  [
   [
    18.2,
    79.7
   ],
   [
    21.5,
    79
   ],
   [
    19,
    78.6
   ],
   [
    17.1,
    76.8
   ],
   [
    15.9,
    76.8
   ],
   [
    13.8,
    77.4
   ],
   [
    14.7,
    77.7
   ],
   [
    10.4,
    79.7
   ],
   [
    18.2,
    79.7
   ]
  ],
  [
   [
    25.4,
    80.4
   ],
   [
    27.4,
    80.1
   ],
   [
    23,
    79.4
   ],
   [
    17.4,
    80.3
   ],
   [
    25.4,
    80.4
   ]
  ],
  [
   [
    51.1,
    80.5
   ],
   [
    47.6,
    80
   ],
   [
    44.9,
    80.6
   ],
   [
    51.1,
    80.5
   ]
  ],
  [
   [
    99.9,
    78.9
   ],
   [
    95,
    79
   ],
   [
    91.2,
    80.3
   ],
   [
    95.9,
    81.2
   ],
   [
    100.2,
    79.8
   ],
   [
    99.9,
    78.9
   ]
  ],
  [
   [
    -87,
    79.7
   ],
   [
    -85.8,
    79.3
   ],
   [
    -90.8,
    78.2
   ],
   [
    -92.9,
    78.3
   ],
   [
    -94,
    78.8
   ],
   [
    -93.2,
    79.4
   ],
   [
    -96.7,
    80.2
   ],
   [
    -94.7,
    81.2
   ],
   [
    -92.4,
    81.3
   ],
   [
    -87,
    79.7
   ]
  ],
  [
   [
    -68.5,
    83.1
   ],
   [
    -61.9,
    82.4
   ],
   [
    -67.7,
    81.5
   ],
   [
    -65.5,
    81.5
   ],
   [
    -71.2,
    79.8
   ],
   [
    -76.9,
    79.3
   ],
   [
    -75.5,
    79.2
   ],
   [
    -76.2,
    79
   ],
   [
    -75.4,
    78.5
   ],
   [
    -79.8,
    77.2
   ],
   [
    -77.9,
    76.8
   ],
   [
    -80.6,
    76.2
   ],
   [
    -89.5,
    76.5
   ],
   [
    -89.6,
    77
   ],
   [
    -87.8,
    77.2
   ],
   [
    -88.3,
    77.9
   ],
   [
    -85,
    77.5
   ],
   [
    -88,
    78.4
   ],
   [
    -85.1,
    79.3
   ],
   [
    -86.9,
    80.2
   ],
   [
    -81.8,
    80.5
   ],
   [
    -87.6,
    80.5
   ],
   [
    -91.6,
    81.9
   ],
   [
    -79.3,
    83.1
   ],
   [
    -68.5,
    83.1
   ]
  ],
  [
   [
    -27.1,
    83.5
   ],
   [
    -20.9,
    82.7
   ],
   [
    -31.4,
    82
   ],
   [
    -22.9,
    82.1
   ],
   [
    -22.1,
    81.7
   ],
   [
    -23.2,
    81.2
   ],
   [
    -15.8,
    81.9
   ],
   [
    -12.2,
    81.3
   ],
   [
    -20.1,
    80.2
   ],
   [
    -17.7,
    80.1
   ],
   [
    -19.7,
    78.8
   ],
   [
    -19.7,
    77.6
   ],
   [
    -18.5,
    77
   ],
   [
    -21.7,
    76.6
   ],
   [
    -19.8,
    76.1
   ],
   [
    -19.6,
    75.2
   ],
   [
    -20.7,
    75.2
   ],
   [
    -19.4,
    74.3
   ],
   [
    -21.6,
    74.2
   ],
   [
    -20.4,
    73.8
   ],
   [
    -20.8,
    73.5
   ],
   [
    -23.6,
    73.3
   ],
   [
    -22.3,
    72.2
   ],
   [
    -24.8,
    72.3
   ],
   [
    -22.1,
    71.5
   ],
   [
    -21.8,
    70.7
   ],
   [
    -23.5,
    70.5
   ],
   [
    -25.5,
    71.4
   ],
   [
    -25.2,
    70.8
   ],
   [
    -26.4,
    70.2
   ],
   [
    -22.4,
    70.1
   ],
   [
    -27.8,
    68.5
   ],
   [
    -31.8,
    68.1
   ],
   [
    -34.2,
    66.7
   ],
   [
    -39.8,
    65.5
   ],
   [
    -41.2,
    63.5
   ],
   [
    -42.8,
    62.7
   ],
   [
    -42.4,
    61.9
   ],
   [
    -43.4,
    60.1
   ],
   [
    -48.3,
    60.9
   ],
   [
    -51.6,
    63.6
   ],
   [
    -54,
    67.2
   ],
   [
    -53,
    68.4
   ],
   [
    -51.5,
    68.7
   ],
   [
    -50.9,
    69.9
   ],
   [
    -54.7,
    69.6
   ],
   [
    -54.4,
    70.8
   ],
   [
    -51.4,
    70.6
   ],
   [
    -55.8,
    71.7
   ],
   [
    -54.7,
    72.6
   ],
   [
    -58.6,
    75.5
   ],
   [
    -68.5,
    76.1
   ],
   [
    -71.4,
    77
   ],
   [
    -66.8,
    77.4
   ],
   [
    -73.3,
    78
   ],
   [
    -65.7,
    79.4
   ],
   [
    -65.3,
    79.8
   ],
   [
    -68,
    80.1
   ],
   [
    -62.2,
    81.3
   ],
   [
    -62.6,
    81.8
   ],
   [
    -50.4,
    82.4
   ],
   [
    -44.5,
    81.7
   ],
   [
    -46.9,
    82.2
   ],
   [
    -46.8,
    82.6
   ],
   [
    -43.4,
    83.2
   ],
   [
    -27.1,
    83.5
   ]
  ]
 ],
 "world_map_lakes": [
  [
   [
    49.1,
    41.3
   ],
   [
    50.4,
    40.3
   ],
   [
    49.6,
    40.2
   ],
   [
    48.9,
    38.8
   ],
   [
    49.2,
    37.6
   ],
   [
    50.8,
    36.9
   ],
   [
    53.8,
    37
   ],
   [
    53.9,
    39
   ],
   [
    52.7,
    40
   ],
   [
    52.9,
    40.9
   ],
   [
    54.7,
    41
   ],
   [
    53.7,
    42.1
   ],
   [
    52.8,
    41.1
   ],
   [
    52.5,
    42.8
   ],
   [
    51.3,
    43.1
   ],
   [
    50.3,
    44.6
   ],
   [
    53,
    45.3
   ],
   [
    53,
    46.9
   ],
   [
    49.1,
    46.4
   ],
   [
    46.7,
    44.6
   ],
   [
    49.1,
    41.3
   ]
  ]
 ]
};
