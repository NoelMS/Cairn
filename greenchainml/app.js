
function applySkeletons() {
  const charts = document.querySelectorAll('.chart-box, .chart-box-large, .stat-card-val, .table-scroll, .network-container, .corridors-grid, .scenario-detail-box');
  charts.forEach(c => c.classList.add('skeleton-shimmer'));
  setTimeout(() => {
    charts.forEach(c => c.classList.remove('skeleton-shimmer'));
  }, 400);
}

function renderKpiSparklines() {
  const drawSparkline = (id, data, color) => {
    const svg = document.getElementById(id);
    if(!svg) return;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 26;
    const pts = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * height * 0.8 - height * 0.1;
      return `${x},${y}`;
    }).join(' ');
    const lastX = width;
    const lastY = height - ((data[data.length-1] - min) / range) * height * 0.8 - height * 0.1;
    
    svg.innerHTML = `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2"/>
    <circle cx="${lastX}" cy="${lastY}" r="2" fill="${color}"/>`;
  };
  drawSparkline('spark-suppliers', [22, 23, 24, 25, 26, 27, 28], 'var(--text-2)');
  drawSparkline('spark-hubs', [14, 15, 15, 16, 17, 18, 18], 'var(--text-2)');
  drawSparkline('spark-routes', [28, 29, 30, 32, 33, 34, 35], 'var(--text-2)');
  drawSparkline('spark-co2', [21400, 22800, 24100, 25500, 26700, 27800, 28450], 'var(--accent)');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  initApp();
}

const appState = {
  data: window.DASHBOARD_DATA || null,
  currentPage: 'page-overview',
  selectedFilters: new Set(['All']),
  isMultiSelect: false,
  weights: {
    cost: 0.3,
    co2: 0.3,
    time: 0.1,
    social: 0.3
  },
  currentRankings: [],
  selectedScenario: 0,
  forecastScenario: 'baseline',
  mapZoom: 1.0,
  mapPanX: 0,
  mapPanY: 0,
  selectedNodeId: null,
  activePortModal: null,
  inspectedSupplier: null,
  compareMode: false,
  compareSelection: [],
  mapViewMode: 'world',
  infoLevel: 'advanced'
};

function safeAnime(config) {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof anime !== 'undefined' && !reduceMotion) {
    return anime(config);
  }
  if (config.targets) {
    let elements = [];
    if (typeof config.targets === 'string') {
      elements = Array.from(document.querySelectorAll(config.targets));
    } else if (config.targets instanceof NodeList || Array.isArray(config.targets)) {
      elements = Array.from(config.targets);
    } else if (config.targets.v !== undefined) {
      elements = [config.targets];
    } else {
      elements = [config.targets];
    }
    elements.forEach(el => {
      if (el.v !== undefined && config.v !== undefined) {
        el.v = config.v;
      }
      if (!el.style && !el.setAttribute) return;
      if (el.style) {
        if (config.opacity !== undefined) el.style.opacity = Array.isArray(config.opacity) ? config.opacity[1] : config.opacity;
        if (config.translateX !== undefined) el.style.transform = `translateX(${Array.isArray(config.translateX) ? config.translateX[1] : config.translateX}px)`;
        if (config.translateY !== undefined) el.style.transform = `translateY(${Array.isArray(config.translateY) ? config.translateY[1] : config.translateY}px)`;
      }
      if (el.setAttribute) {
        if (config.height !== undefined) {
           const h = typeof config.height === 'function' ? config.height(el) : config.height;
           el.setAttribute('height', h);
        }
        if (config.y !== undefined) {
           const y = typeof config.y === 'function' ? config.y(el) : config.y;
           el.setAttribute('y', y);
        }
      }
    });
  }
  if (config.update && config.targets && config.targets.v !== undefined) {
    config.update({ animations: [{ currentValue: config.v }] });
  }
  if (config.complete) {
    config.complete();
  }
}

const theme = {
  emerald: 'var(--accent)',
  teal: 'var(--ok)',
  indigo: 'var(--warn)',
  blue: 'var(--text-2)',
  amber: 'var(--text)',
  rose: 'var(--err)',
  grid: 'var(--line)',
  textDim: 'var(--muted)',
  textLight: 'var(--text)'
};

function suiteIsLight() {
  let t = null;
  try { t = localStorage.getItem('nexus.theme'); } catch (e) {}
  if (t === 'light') return true;
  if (t === 'dark') return false;
  return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
}

function syncSuiteTheme() {
  let t = null;
  try { t = localStorage.getItem('nexus.theme'); } catch (e) {}
  if (t) document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
  document.body.classList.toggle('light-theme', suiteIsLight());
}

window.addEventListener('storage', (e) => {
  if (e.key === 'nexus.theme') syncSuiteTheme();
});

function initApp() {
  syncSuiteTheme();
  if (!appState.data && typeof window.DASHBOARD_DATA !== 'undefined') {
    appState.data = window.DASHBOARD_DATA;
  }
  if (!appState.data) {
    fetch('../data.json')
      .then(res => res.json())
      .then(d => {
        appState.data = d;
        boot();
      })
      .catch(e => console.error(e));
    return;
  }
  boot();
}

function boot() {
  setupNavigation();
  setupPortModal();
  setupFilterPills();
  setupFilterScrollControls();
  setupMultiSelectToggle();
  setupMcdmPresets();
  setupWeightSliders();
  setupSearch();
  setupScenarioButtons();
  setupForecastToggles();
  setupMapControls();
  setupTelemetryRefresh();
  setupCompareMode();
  setupThemeToggle();
  setupInfoLevelToggle();
  setupPrintButton();
  setupExportButtons();
  setupResizeHandler();
  setupKeyboardShortcuts();
  recalculateDynamicTopsis();
  renderActiveView();
}

function setupThemeToggle() {
  const btn = document.getElementById('btn-theme-toggle');
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = 'true';
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    btn.textContent = isLight ? 'Light' : 'Dark';
    renderActiveView();
  });
}

function setupInfoLevelToggle() {
  const btn = document.getElementById('btn-info-level');
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = 'true';
  btn.addEventListener('click', () => {
    document.body.classList.toggle('info-basic');
    const isBasic = document.body.classList.contains('info-basic');
    appState.infoLevel = isBasic ? 'basic' : 'advanced';
    btn.textContent = isBasic ? 'Detail: basic' : 'Detail: full';
    renderActiveView();
  });
}

function setupPrintButton() {
  const btn = document.getElementById('btn-print-report');
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = 'true';
  btn.addEventListener('click', () => {
    prepareAndPrint();
  });
  window.addEventListener('beforeprint', () => {
    appState.selectedNodeId = null;
    appState.mapZoom = 1.0;
    appState.mapPanX = 0;
    appState.mapPanY = 0;
    const views = document.querySelectorAll('.page-view');
    views.forEach(v => v.classList.add('active'));
    renderOverviewPage();
    renderSuppliersPage();
    renderNetworkPage();
    renderForecastPage();
    renderScenariosPage();
  });
  window.addEventListener('afterprint', () => {
    const views = document.querySelectorAll('.page-view');
    views.forEach(v => {
      if (v.id === appState.currentPage) {
        v.classList.add('active');
      } else {
        v.classList.remove('active');
      }
    });
  });
}

function prepareAndPrint() {
  const prevPage = appState.currentPage;
  appState.selectedNodeId = null;
  appState.mapZoom = 1.0;
  appState.mapPanX = 0;
  appState.mapPanY = 0;
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => v.classList.add('active'));
  renderOverviewPage();
  renderSuppliersPage();
  renderNetworkPage();
  renderForecastPage();
  renderScenariosPage();
  window.print();
  views.forEach(v => {
    if (v.id === prevPage) {
      v.classList.add('active');
    } else {
      v.classList.remove('active');
    }
  });
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function setupExportButtons() {
  const supBtn = document.getElementById('export-suppliers-btn');
  if (supBtn) {
    supBtn.addEventListener('click', () => {
      if (!appState.data || !appState.data.suppliers) return;
      let csv = 'Category,Rank_in_category,Supplier,Country,Cost_USD_per_t,CO2e_t_per_t,Transit_days,Social_score,TOPSIS,Carbon_basis\n';
      appState.data.suppliers.forEach(s => {
        csv += `"${s.category}","${s.rank}","${s.name}","${s.country}","${s.cost_per_unit}","${s.co2_per_unit}","${s.transit_days}","${s.social_score}","${s.topsis_score}","${s.carbon_basis}"\n`;
      });
      downloadCSV(csv, 'greenchain_suppliers.csv');
    });
  }

  const corBtn = document.getElementById('export-corridors-btn');
  if (corBtn) {
    corBtn.addEventListener('click', () => {
      if (!appState.data || !appState.data.corridors) return;
      let csv = 'Corridor,Product,Mode,Distance_km,Tonnes_per_year,EF_kg_per_tkm,Freight_kg_CO2e_per_t,Status\n';
      appState.data.corridors.forEach(c => {
        csv += `"${c.corridor}","${c.commodity}","${c.mode}","${c.distance_km}","${c.flow_tons}","${c.ef_kg_per_tkm}","${c.co2_kg_per_t}","${c.status}"\n`;
      });
      downloadCSV(csv, 'greenchain_corridors.csv');
    });
  }

  const hubBtn = document.getElementById('export-hubs-btn');
  if (hubBtn) {
    hubBtn.addEventListener('click', () => {
      if (!appState.data || !appState.data.demand_hubs) return;
      let csv = 'Hub,Location,Country,Type,Demand_MW,Priority\n';
      appState.data.demand_hubs.forEach(h => {
        csv += `"${h.name}","${h.location_name}","${h.country}","${h.project_type}","${h.demand_annual_mw}","${h.priority}"\n`;
      });
      downloadCSV(csv, 'greenchain_demand_hubs.csv');
    });
  }
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const pmodal = document.getElementById('port-modal');
      if (pmodal && pmodal.classList.contains('active')) {
        pmodal.classList.remove('active');
      }
      if (appState.selectedNodeId) {
        appState.selectedNodeId = null;
        if (appState.currentPage === 'page-network') renderNetworkPage();
      }
    }
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    const pages = ['page-overview', 'page-suppliers', 'page-network', 'page-forecast', 'page-scenarios'];
    const num = parseInt(e.key);
    if (num >= 1 && num <= 5) {
      const target = pages[num - 1];
      if (appState.currentPage !== target) {
        document.querySelectorAll('.nav-item').forEach((b, i) => {
           b.classList.toggle('active', i === num - 1);
        });
        navigateTo(target);
      }
    }
  });
}

function setupResizeHandler() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderActiveView();
    }, 250);
  });
}

function setupNavigation() {
  const items = document.querySelectorAll('.nav-item');
  items.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target === appState.currentPage) return;
      items.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    applySkeletons();
      navigateTo(target);
    });
  });

}

function navigateTo(pageId) {
  const current = document.getElementById(appState.currentPage);
  const next = document.getElementById(pageId);
  if (!current || !next) return;

  current.classList.remove('active');
  next.classList.add('active');
  appState.currentPage = pageId;
  renderActiveView();
}

function setupFilterPills() {
  const container = document.getElementById('filter-pills-container');
  if (!container || !appState.data) return;
  container.innerHTML = '';

  const pillList = ['All'];
  if (appState.data.regions) {
    appState.data.regions.forEach(r => {
      if (r !== 'All' && !pillList.includes(r)) pillList.push(r);
    });
  }
  if (appState.data.countries) {
    appState.data.countries.forEach(c => {
      if (!pillList.includes(c)) pillList.push(c);
    });
  }

  pillList.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill' + (appState.selectedFilters.has(item) ? ' active' : '');
    btn.dataset.filter = item;
    btn.textContent = item === 'All' ? 'All Regions' : item;

    btn.addEventListener('click', () => {
      handleFilterClick(item);
    });
    container.appendChild(btn);
  });
}

function setupFilterScrollControls() {
  const container = document.getElementById('filter-pills-container');
  const btnLeft = document.getElementById('btn-scroll-left');
  const btnRight = document.getElementById('btn-scroll-right');

  if (btnLeft && container) {
    btnLeft.addEventListener('click', () => {
      container.scrollBy({ left: -220, behavior: 'smooth' });
    });
  }
  if (btnRight && container) {
    btnRight.addEventListener('click', () => {
      container.scrollBy({ left: 220, behavior: 'smooth' });
    });
  }
  if (container) {
    container.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }
}

function setupMultiSelectToggle() {
  const btn = document.getElementById('btn-multi-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    appState.isMultiSelect = !appState.isMultiSelect;
    btn.textContent = appState.isMultiSelect ? 'Multi-Select: ON' : 'Multi-Select: OFF';
    btn.classList.toggle('active', appState.isMultiSelect);
    if (!appState.isMultiSelect && appState.selectedFilters.size > 1) {
      const first = Array.from(appState.selectedFilters)[0];
      appState.selectedFilters.clear();
      appState.selectedFilters.add(first || 'All');
      const pills = document.querySelectorAll('.filter-pill');
      pills.forEach(p => {
        p.classList.toggle('active', appState.selectedFilters.has(p.dataset.filter));
      });
      recalculateDynamicTopsis();
      renderActiveView();
    }
  });
}

function handleFilterClick(item) {
  if (item === 'All') {
    appState.selectedFilters.clear();
    appState.selectedFilters.add('All');
  } else if (!appState.isMultiSelect) {
    appState.selectedFilters.clear();
    appState.selectedFilters.add(item);
  } else {
    appState.selectedFilters.delete('All');
    if (appState.selectedFilters.has(item)) {
      appState.selectedFilters.delete(item);
    } else {
      appState.selectedFilters.add(item);
    }
    if (appState.selectedFilters.size === 0) {
      appState.selectedFilters.add('All');
    }
  }

  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(p => {
    p.classList.toggle('active', appState.selectedFilters.has(p.dataset.filter));
  });

  recalculateDynamicTopsis();
  renderActiveView();
}

function setupMcdmPresets() {
  const container = document.getElementById('preset-container');
  if (!container) return;
  const presets = {
    balanced: { cost: 30, co2: 30, time: 10, social: 30 },
    netzero: { cost: 20, co2: 55, time: 5, social: 20 },
    cost: { cost: 60, co2: 15, time: 15, social: 10 },
    resilience: { cost: 20, co2: 15, time: 45, social: 20 }
  };

  const chips = container.querySelectorAll('.preset-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const pKey = chip.dataset.preset;
      const pVals = presets[pKey];
      if (!pVals) return;
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      document.getElementById('sl-cost').value = pVals.cost;
      document.getElementById('sl-co2').value = pVals.co2;
      document.getElementById('sl-time').value = pVals.time;
      document.getElementById('sl-social').value = pVals.social;

      document.getElementById('lbl-w-cost').textContent = pVals.cost + '%';
      document.getElementById('lbl-w-co2').textContent = pVals.co2 + '%';
      document.getElementById('lbl-w-time').textContent = pVals.time + '%';
      document.getElementById('lbl-w-social').textContent = pVals.social + '%';

      appState.weights.cost = pVals.cost / 100.0;
      appState.weights.co2 = pVals.co2 / 100.0;
      appState.weights.time = pVals.time / 100.0;
      appState.weights.social = pVals.social / 100.0;

      recalculateDynamicTopsis();
      if (appState.currentPage === 'page-suppliers') {
        renderSuppliersPage();
      }
    });
  });
}

function getFilteredSuppliers() {
  if (!appState.currentRankings) return [];
  if (appState.selectedFilters.has('All')) return appState.currentRankings;
  return appState.currentRankings.filter(s => {
    return appState.selectedFilters.has(s.region) || appState.selectedFilters.has(s.country);
  });
}

function getFilteredHubs() {
  if (!appState.data || !appState.data.demand_hubs) return [];
  if (appState.selectedFilters.has('All')) return appState.data.demand_hubs;
  return appState.data.demand_hubs.filter(h => {
    return appState.selectedFilters.has(h.region) || appState.selectedFilters.has(h.country);
  });
}

if (/^https?:$/.test(location.protocol) && window.top === window) {
  const beat = () => fetch('../__nexus/heartbeat', { cache: 'no-store' }).catch(() => {});
  beat();
  setInterval(beat, 20000);
}

function getFilteredCorridors() {
  if (!appState.data || !appState.data.corridors) return [];
  if (appState.selectedFilters.has('All')) return appState.data.corridors;
  return appState.data.corridors.filter(c => {
    return appState.selectedFilters.has(c.region) || appState.selectedFilters.has(c.country);
  });
}

function getFilteredTelemetry() {
  if (!appState.data || !appState.data.telemetry) return [];
  if (appState.selectedFilters.has('All')) return appState.data.telemetry;
  return appState.data.telemetry.filter(t => {
    return appState.selectedFilters.has(t.region) || appState.selectedFilters.has(t.country);
  });
}

function setupWeightSliders() {
  setupAhp();
  const sliders = [
    { id: 'sl-cost', key: 'cost', lbl: 'lbl-w-cost' },
    { id: 'sl-co2', key: 'co2', lbl: 'lbl-w-co2' },
    { id: 'sl-time', key: 'time', lbl: 'lbl-w-time' },
    { id: 'sl-social', key: 'social', lbl: 'lbl-w-social' }
  ];

  sliders.forEach(s => {
    const el = document.getElementById(s.id);
    if (!el) return;
    el.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      appState.weights[s.key] = val / 100.0;
      
      const totalW = Object.values(appState.weights).reduce((a, b) => a + b, 0) || 1;
      sliders.forEach(sl => {
        const normVal = Math.round((appState.weights[sl.key] / totalW) * 100);
        document.getElementById(sl.lbl).textContent = normVal + '%';
      });

      recalculateDynamicTopsis();
      if (appState.currentPage === 'page-suppliers') {
        renderSuppliersPage();
      }
    });
  });

  const resetBtn = document.getElementById('btn-reset-weights');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      appState.weights = { cost: 0.3, co2: 0.3, time: 0.1, social: 0.3 };
      Object.entries(appState.weights).forEach(([k, v]) => {
        document.getElementById('sl-' + k).value = Math.round(v * 100);
        document.getElementById('lbl-w-' + k).textContent = Math.round(v * 100) + '%';
      });
      recalculateDynamicTopsis();
      if (appState.currentPage === 'page-suppliers') {
        renderSuppliersPage();
      }
    });
  }
}

const AHP_CRIT = [['cost', 'Cost'], ['co2', 'CO2e'], ['time', 'Transit time'], ['social', 'Social']];
const AHP_RI = { 1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32 };

function ahpSolve(A) {
  const n = A.length;
  let w = new Array(n).fill(1 / n);
  for (let it = 0; it < 100; it++) {
    const next = A.map(row => row.reduce((s, a, j) => s + a * w[j], 0));
    const sum = next.reduce((s, v) => s + v, 0);
    w = next.map(v => v / sum);
  }
  const Aw = A.map(row => row.reduce((s, a, j) => s + a * w[j], 0));
  const lambda = Aw.reduce((s, v, i) => s + v / w[i], 0) / n;
  const ci = n > 1 ? (lambda - n) / (n - 1) : 0;
  const ri = AHP_RI[n] || 1.12;
  return { w, lambda, ci, cr: ri ? ci / ri : 0 };
}

function setupAhp() {
  const box = document.getElementById('ahp-pairs');
  if (!box || box.childElementCount) return;
  const n = AHP_CRIT.length;
  const pairs = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([i, j]);
  box.innerHTML = pairs.map(([i, j], k) => `<div class="ahp-pair"><span>${AHP_CRIT[i][1]}</span><input type="range" min="-8" max="8" value="0" step="1" id="ahp-${k}" aria-label="${AHP_CRIT[i][1]} against ${AHP_CRIT[j][1]}"><span>${AHP_CRIT[j][1]}</span><output id="ahp-${k}-v">equal</output></div>`).join('');
  let last = null;
  const read = () => {
    const A = Array.from({ length: n }, () => new Array(n).fill(1));
    pairs.forEach(([i, j], k) => {
      const v = parseInt(document.getElementById('ahp-' + k).value, 10);
      const a = v <= 0 ? 1 + Math.abs(v) : 1 / (1 + v);
      A[i][j] = a; A[j][i] = 1 / a;
      document.getElementById('ahp-' + k + '-v').textContent = v === 0 ? 'equal' : (v < 0 ? AHP_CRIT[i][1] : AHP_CRIT[j][1]) + ' ' + (1 + Math.abs(v)) + 'x';
    });
    last = ahpSolve(A);
    const ok = last.cr < 0.1;
    document.getElementById('ahp-out').innerHTML = AHP_CRIT.map((c, i) => `<div><span>${c[1]}</span><b>${(last.w[i] * 100).toFixed(1)}%</b></div>`).join('') +
      `<p class="${ok ? 'ahp-ok' : 'ahp-bad'}">Consistency ratio ${last.cr.toFixed(3)} (lambda max ${last.lambda.toFixed(3)}). ${ok ? 'Acceptable: below 0.10.' : 'Above 0.10: some judgements contradict each other. Revise before applying.'}</p>`;
    document.getElementById('btn-ahp-apply').disabled = !ok;
  };
  pairs.forEach((p, k) => document.getElementById('ahp-' + k).addEventListener('input', read));
  read();
  document.getElementById('btn-ahp-apply').addEventListener('click', () => {
    if (!last || last.cr >= 0.1) return;
    AHP_CRIT.forEach(([key], i) => {
      appState.weights[key] = last.w[i];
      const sl = document.getElementById('sl-' + key);
      if (sl) sl.value = Math.round(last.w[i] * 100);
      const lb = document.getElementById('lbl-w-' + key);
      if (lb) lb.textContent = Math.round(last.w[i] * 100) + '%';
    });
    document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
    recalculateDynamicTopsis();
    if (appState.currentPage === 'page-suppliers') renderSuppliersPage();
  });
}

const TOPSIS_CRIT = [['cost', 'cost_per_unit', false], ['co2', 'co2_per_unit', false], ['time', 'transit_days', false], ['social', 'social_score', true]];

function topsisScores(list, w) {
  const v = TOPSIS_CRIT.map(([key, field]) => {
    const norm = Math.hypot(...list.map(s => s[field])) || 1;
    return list.map(s => s[field] / norm * w[key]);
  });
  const best = v.map((col, c) => TOPSIS_CRIT[c][2] ? Math.max(...col) : Math.min(...col));
  const worst = v.map((col, c) => TOPSIS_CRIT[c][2] ? Math.min(...col) : Math.max(...col));
  return list.map((s, i) => {
    const dPos = Math.hypot(...v.map((col, c) => col[i] - best[c]));
    const dNeg = Math.hypot(...v.map((col, c) => col[i] - worst[c]));
    return dPos + dNeg > 0 ? dNeg / (dPos + dNeg) * 100 : 50;
  });
}

function recalculateDynamicTopsis() {
  if (!appState.data || !appState.data.suppliers) return;
  const totalW = Object.values(appState.weights).reduce((a, b) => a + b, 0) || 1;
  const w = {};
  Object.keys(appState.weights).forEach(k => { w[k] = appState.weights[k] / totalW; });
  const cats = appState.data.categories || [...new Set(appState.data.suppliers.map(s => s.category))];
  const out = [];
  cats.forEach(cat => {
    const group = appState.data.suppliers.filter(s => s.category === cat);
    const sc = topsisScores(group, w);
    group.map((s, i) => ({ ...s, topsis_score: Math.round(sc[i] * 10) / 10 }))
      .sort((a, b) => b.topsis_score - a.topsis_score)
      .forEach((s, i) => { s.rank = i + 1; out.push(s); });
  });
  appState.currentRankings = out;
}

function setupSearch() {
  const input = document.getElementById('supplier-search');
  if (!input) return;
  input.addEventListener('input', () => {
    renderSupplierTable();
  });
}

function setupForecastToggles() {
  const container = document.getElementById('forecast-scenario-toggles');
  if (!container) return;
  const btns = container.querySelectorAll('.forecast-pill');
  btns.forEach(b => {
    b.onclick = (e) => {
      e.preventDefault();
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      appState.forecastScenario = b.dataset.growth || 'baseline';
      renderForecastPage();
    };
  });
}

function syncForecastToggles() {
  const container = document.getElementById('forecast-scenario-toggles');
  if (!container) return;
  const btns = container.querySelectorAll('.forecast-pill');
  btns.forEach(b => {
    b.classList.toggle('active', (b.dataset.growth || 'baseline') === appState.forecastScenario);
  });
}

function setupTelemetryRefresh() {
  const btn = document.getElementById('refresh-telemetry-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.textContent = 'Refreshing...';
    btn.disabled = true;
    const ports = (appState.data && appState.data.telemetry) ? appState.data.telemetry : [];
    let completed = 0;
    
    if (ports.length === 0) {
      btn.textContent = 'Refresh Telemetry';
      btn.disabled = false;
      return;
    }
    
    ports.forEach(port => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const url = 'https:' + '/' + '/api.open-meteo.com/v1/forecast?latitude=' + port.lat + '&longitude=' + port.lon + '&current=temperature_2m,wind_speed_10m';
      fetch(url, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          if (data && data.current) {
            port.temperature_c = Math.round(data.current.temperature_2m * 10) / 10;
            port.windspeed_kmh = Math.round(data.current.wind_speed_10m * 10) / 10;
          }
        })
        .catch(err => { })
        .finally(() => {
          clearTimeout(timeoutId);
          completed++;
          if (completed === ports.length) {
            btn.textContent = 'Refresh Telemetry';
            btn.disabled = false;
            renderOverviewPage();
          }
        });
    });
  });
}

function setupMapControls() {
  const container = document.getElementById('network-map');
  const zoomIn = document.getElementById('map-zoom-in');
  const zoomOut = document.getElementById('map-zoom-out');
  const zoomReset = document.getElementById('map-zoom-reset');
  const btnWorld = document.getElementById('btn-map-mode-world');
  const btnGrid = document.getElementById('btn-map-mode-grid');

  if (btnWorld) {
    btnWorld.onclick = () => {
      appState.mapViewMode = 'world';
      btnWorld.classList.add('active');
      if (btnGrid) btnGrid.classList.remove('active');
      renderNetworkPage();
    };
  }

  if (btnGrid) {
    btnGrid.onclick = () => {
      appState.mapViewMode = 'grid';
      btnGrid.classList.add('active');
      if (btnWorld) btnWorld.classList.remove('active');
      renderNetworkPage();
    };
  }

  if (zoomIn) {
    zoomIn.onclick = () => {
      appState.mapZoom = Math.min(3.5, appState.mapZoom + 0.3);
      applyMapTransform();
    };
  }
  if (zoomOut) {
    zoomOut.onclick = () => {
      appState.mapZoom = Math.max(0.7, appState.mapZoom - 0.3);
      applyMapTransform();
    };
  }
  if (zoomReset) {
    zoomReset.onclick = () => {
      appState.mapZoom = 1.0;
      appState.mapPanX = 0;
      appState.mapPanY = 0;
      appState.selectedNodeId = null;
      applyMapTransform();
      const detail = document.getElementById('map-node-detail');
      if (detail) detail.style.display = 'none';
      renderNetworkPage();
    };
  }

  if (container) {
    container.onwheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      appState.mapZoom = Math.max(0.7, Math.min(3.5, appState.mapZoom + delta));
      applyMapTransform();
    };

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    container.onmousedown = (e) => {
      if (e.target.closest('#map-node-detail') || e.target.closest('.map-controls')) return;
      isDragging = true;
      startX = e.clientX - appState.mapPanX;
      startY = e.clientY - appState.mapPanY;
      container.style.cursor = 'grabbing';
    };

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      appState.mapPanX = e.clientX - startX;
      appState.mapPanY = e.clientY - startY;
      applyMapTransform();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      if (container) container.style.cursor = 'default';
    });
  }
}

function applyMapTransform() {
  const viewport = document.getElementById('map-viewport');
  if (viewport) {
    viewport.setAttribute('transform', `translate(${appState.mapPanX}, ${appState.mapPanY}) scale(${appState.mapZoom})`);
  }
}

function setupCompareMode() {
  const btn = document.getElementById('toggle-compare-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    appState.compareMode = !appState.compareMode;
    if (!appState.compareMode) {
      appState.compareSelection = [];
      btn.textContent = 'Compare: OFF';
      btn.classList.remove('active');
    } else {
      btn.textContent = 'Compare: ON';
      btn.classList.add('active');
    }
    renderRankingsBarChart();
    renderSupplierTable();
    renderRadarChart();
  });
}

function setupScenarioButtons() {
  const strip = document.getElementById('scenario-selector');
  const all = (appState.data && appState.data.pareto) || [];
  if (strip) {
    strip.innerHTML = all.map((p, i) => p.role ? `<button class="scenario-pill" data-scenario="${i}">${p.strategy}</button>` : '').join('');
    const bal = all.findIndex(p => /Balanced/.test(p.strategy));
    appState.selectedScenario = bal >= 0 ? bal : 0;
    strip.querySelectorAll('.scenario-pill').forEach(b => b.classList.toggle('active', +b.dataset.scenario === appState.selectedScenario));
  }
  const btns = document.querySelectorAll('.scenario-pill');
  btns.forEach(b => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      appState.selectedScenario = parseInt(b.dataset.scenario || '0');
      renderScenariosPage();
    });
  });
}

function renderActiveView() {
  renderKpis();

  if (appState.currentPage === 'page-overview') {
    renderOverviewPage();
  } else if (appState.currentPage === 'page-suppliers') {
    renderSuppliersPage();
  } else if (appState.currentPage === 'page-network') {
    renderNetworkPage();
  } else if (appState.currentPage === 'page-forecast') {
    renderForecastPage();
  } else if (appState.currentPage === 'page-scenarios') {
    renderScenariosPage();
  }
}

function renderKpis() {
  renderKpiSparklines();
  const sups = getFilteredSuppliers();
  const hubs = getFilteredHubs();
  const corridors = getFilteredCorridors();

  const abated = Math.round((appState.data && appState.data.summary) ? appState.data.summary.annual_co2_abated_tons : 0);

  animateNumber('kpi-suppliers', sups.length);
  animateNumber('kpi-hubs', hubs.length);
  animateNumber('kpi-routes', corridors.length);
  animateNumber('kpi-co2', abated);
}

function animateNumber(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  safeAnime({
    targets: { v: 0 },
    v: val,
    round: 1,
    duration: 800,
    easing: 'easeOutExpo',
    update: (a) => {
      el.textContent = Math.round(a.animations[0].currentValue).toLocaleString();
    }
  });
}

function renderOverviewPage() {
  const container = document.getElementById('telemetry-feed');
  if (!container) return;
  container.innerHTML = '';
  const ports = getFilteredTelemetry();

  if (ports.length === 0) {
    container.innerHTML = '<p class="empty-note">No ports are monitored in this region. Showing the regional baseline.</p>';
    return;
  }

  ports.forEach(p => {
    const card = document.createElement('div');
    card.className = 'telemetry-card';
    const isOpt = p.delay_risk === 'Low';
    const badgeCls = isOpt ? 'badge-optimal' : 'badge-advisory';
    card.innerHTML = `
      <div class="tel-head">
        <span class="tel-port">${p.port}</span>
        <span class="tel-badge ${badgeCls}">${p.delay_risk} risk</span>
      </div>
      <div class="tel-row">
        <span>${p.temperature_c} deg C</span>
        <span>Wind ${p.windspeed_kmh} km/h</span>
      </div>
      <div class="tel-sub-row">
        <span>${p.country} | ${p.hub_type}</span>
        <span class="tel-status">${p.status}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      openPortModal(p);
    });
    container.appendChild(card);
  });

  renderEsgPillars();
}

function renderEsgPillars() {
  const chartBox = document.getElementById('esg-visual');
  const legendBox = document.getElementById('esg-legend');
  if (!chartBox || !legendBox || !appState.data) return;

  const pillars = appState.data.esg_pillars || [];
  const sups = getFilteredSuppliers();

  chartBox.innerHTML = '';
  legendBox.innerHTML = '';

  const w = chartBox.clientWidth || 280;
  const h = 240;
  const cx = w / 2;
  const cy = h / 2;
  const r = 85;
  const strokeW = 19;

  const svg = createSvg('svg', { viewBox: `0 0 ${w} ${h}`, class: 'svg-chart' });


  let totalScore = 0;

  pillars.forEach((p, i) => {
    const scoreVal = Math.max(0, Math.min(100, p.score));
    totalScore += scoreVal;
    const gap = 0.05;
    const ang = (Math.PI * 2 / pillars.length) * i - Math.PI / 2 + gap / 2;
    const angEnd = (Math.PI * 2 / pillars.length) * (i + 1) - Math.PI / 2 - gap / 2;
    const angVal = ang + (angEnd - ang) * scoreVal / 100;
    const arc = (a, b) => `M ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(b)} ${cy + r * Math.sin(b)}`;

    svg.appendChild(createSvg('path', { d: arc(ang, angEnd), fill: 'none', stroke: 'var(--line)', 'stroke-width': strokeW }));
    const path = createSvg('path', {
      d: arc(ang, angVal),
      fill: 'none',
      stroke: 'var(--accent)',
      'stroke-width': strokeW,
      style: 'cursor:pointer;'
    });

    path.addEventListener('mouseenter', (ev) => {
      showTooltip(ev, `<strong>${p.pillar}</strong><br>Balanced plan: ${scoreVal} / 100<br>Cheapest plan: ${p.benchmark} / 100<br>${p.desc}`);
    });
    path.addEventListener('mouseleave', hideTooltip);

    svg.appendChild(path);

    const lRow = document.createElement('div');
    lRow.className = 'esg-legend-row';
    lRow.innerHTML = `
      <div class="esg-row-top">
        <span class="esg-row-name">${p.pillar}</span>
        <span class="esg-row-score">${scoreVal}%</span>
      </div>
      <div class="esg-row-desc">${p.desc}</div>
    `;
    legendBox.appendChild(lRow);
  });

  const centerText = createSvg('text', {
    x: cx,
    y: cy - 4,
    'text-anchor': 'middle',
    fill: theme.textLight,
    'font-size': '15px',
    'font-weight': '700',
    'font-family': 'Manrope, sans-serif'
  });
  const avgScore = pillars.length > 0 ? (totalScore / pillars.length) : 0;
  centerText.textContent = `${Math.round(avgScore)}%`;
  svg.appendChild(centerText);

  const centerSub = createSvg('text', {
    x: cx,
    y: cy + 14,
    'text-anchor': 'middle',
    fill: theme.textDim,
    'font-size': '9px'
  });
  centerSub.textContent = 'Composite ESG';
  svg.appendChild(centerSub);

  chartBox.appendChild(svg);
}

function renderSuppliersPage() {
  renderRankingsBarChart();
  renderRadarChart();
  renderSupplierTable();
}

function renderRankingsBarChart() {
  const container = document.getElementById('rankings-chart');
  if (!container) return;
  container.innerHTML = '';

  const sups = getFilteredSuppliers();
  if (sups.length === 0) {
    container.innerHTML = '<p class="empty-note">No suppliers match this filter. Choose another region.</p>';
    return;
  }

  const w = container.clientWidth || 550;
  const h = 290;
  const padL = 50;
  const padR = 25;
  const padT = 25;
  const padB = 65;

  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const svg = createSvg('svg', { viewBox: `0 0 ${w} ${h}`, class: 'svg-chart' });

  for (let i = 0; i <= 4; i++) {
    const yVal = padT + (i / 4) * chartH;
    const scoreVal = 100 - i * 25;

    const grid = createSvg('line', {
      x1: padL,
      y1: yVal,
      x2: w - padR,
      y2: yVal,
      stroke: theme.grid,
      'stroke-dasharray': '3,3'
    });
    svg.appendChild(grid);

    const lbl = createSvg('text', {
      x: padL - 8,
      y: yVal + 4,
      'text-anchor': 'end',
      fill: theme.textDim,
      'font-size': '10px',
      'font-family': 'Manrope, sans-serif'
    });
    lbl.textContent = scoreVal;
    svg.appendChild(lbl);
  }

  const yAxisTitle = createSvg('text', {
    x: -h / 2 + 20,
    y: 15,
    transform: 'rotate(-90)',
    'text-anchor': 'middle',
    fill: theme.textDim,
    'font-size': '10px'
  });
  yAxisTitle.textContent = 'TOPSIS Closeness Score (0 - 100)';
  svg.appendChild(yAxisTitle);

  const n = sups.length;
  const barW = Math.min(32, (chartW / n) * 0.65);
  const slotW = chartW / n;

  sups.forEach((s, idx) => {
    const x = padL + idx * slotW + (slotW - barW) / 2;
    const barH = (s.topsis_score / 100) * chartH;
    const y = padT + chartH - barH;

    const color = s.rank === 1 ? theme.emerald : (s.rank < 3 ? theme.teal : theme.blue);

    const bar = createSvg('rect', {
      x: x,
      y: padT + chartH,
      width: barW,
      height: 0,
      rx: 3,
      fill: color,
      class: 'ranking-svg-bar',
      style: 'cursor:pointer;'
    });
    bar.dataset.targetY = y;
    bar.dataset.targetH = barH;

    bar.addEventListener('mouseenter', (ev) => {
      showTooltip(ev, `
        <strong>${s.name}</strong><br>
        Rank in ${s.category}: #${s.rank} | TOPSIS score: ${s.topsis_score}<br>
        Origin: ${s.location} (${s.country})<br>
        Price: $${s.cost_per_unit.toLocaleString()}/t | CO2e: ${s.co2_per_unit} t/t<br>
        Transit: ${s.transit_days} days | ${s.esg_tier}
      `);
    });
    bar.addEventListener('mouseleave', hideTooltip);
        bar.addEventListener('click', () => {
      if (appState.compareMode) {
        if (appState.compareSelection.includes(s.id)) {
          appState.compareSelection = appState.compareSelection.filter(id => id !== s.id);
        } else if (appState.compareSelection.length < 3) {
          appState.compareSelection.push(s.id);
        }
        renderRankingsBarChart();
        renderSupplierTable();
      } else {
        appState.inspectedSupplier = s;
      }
      renderRadarChart();
    });

    if (appState.compareMode) {
      if (appState.compareSelection.includes(s.id)) {
        bar.style.opacity = '1';
        bar.setAttribute('stroke', 'var(--bg)');
        bar.setAttribute('stroke-width', '1.5');
      } else {
        bar.style.opacity = '0.4';
      }
    }

    svg.appendChild(bar);

    const valTxt = createSvg('text', {
      x: x + barW / 2,
      y: y - 5,
      'text-anchor': 'middle',
      fill: theme.textLight,
      'font-size': '9px',
      'font-family': 'Manrope, sans-serif',
      'font-weight': '600'
    });
    valTxt.textContent = s.topsis_score.toFixed(1);
    svg.appendChild(valTxt);

    const nameTxt = createSvg('text', {
      x: x + barW / 2,
      y: padT + chartH + 15,
      'text-anchor': 'end',
      fill: theme.textLight,
      'font-size': '9px',
      transform: `rotate(-40, ${x + barW / 2}, ${padT + chartH + 15})`
    });
    nameTxt.textContent = s.name.length > 13 ? s.name.substring(0, 12) + '..' : s.name;
    svg.appendChild(nameTxt);
  });

  const xAxisLine = createSvg('line', {
    x1: padL,
    y1: padT + chartH,
    x2: w - padR,
    y2: padT + chartH,
    stroke: theme.textDim
  });
  svg.appendChild(xAxisLine);

  container.appendChild(svg);

  safeAnime({
    targets: container.querySelectorAll('.ranking-svg-bar'),
    y: (el) => parseFloat(el.dataset.targetY),
    height: (el) => parseFloat(el.dataset.targetH),
    delay: anime.stagger(30),
    duration: 600,
    easing: 'easeOutExpo'
  });
}

function renderRadarChart() {
  const container = document.getElementById('radar-chart');
  if (!container) return;
  container.innerHTML = '';

  const sups = getFilteredSuppliers();
  if (sups.length === 0) return;

  let targets = [];
  if (appState.compareMode && appState.compareSelection.length > 0) {
    targets = sups.filter(s => appState.compareSelection.includes(s.id));
  } else {
    targets = [appState.inspectedSupplier || sups[0]];
  }
  
  if (targets.length === 0) targets = [appState.inspectedSupplier || sups[0]];

  const w = container.clientWidth || 360;
  const h = 270;
  const cx = w / 2;
  const cy = h / 2 + 2;
  const r = Math.min(cx - 75, cy - 42);

  const svg = createSvg('svg', { viewBox: `0 0 ${w} ${h}`, class: 'svg-chart' });

  const n = 4;
  for (let lvl = 1; lvl <= 5; lvl++) {
    const ringR = (r / 5) * lvl;
    const ringPts = [];
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 / n) * i - Math.PI / 2;
      ringPts.push(`${cx + ringR * Math.cos(ang)},${cy + ringR * Math.sin(ang)}`);
    }
    const poly = createSvg('polygon', {
      points: ringPts.join(' '),
      fill: 'none',
      stroke: theme.grid,
      'stroke-width': '1'
    });
    svg.appendChild(poly);

    const lvlTxt = createSvg('text', {
      x: cx + 4,
      y: cy - ringR + 3,
      fill: theme.textDim,
      'font-size': '8px',
      'font-family': 'Manrope, sans-serif'
    });
    lvlTxt.textContent = `${lvl * 20}%`;
    svg.appendChild(lvlTxt);
  }

  const baseLabels = ['Cost', 'CO2e', 'Transit time', 'Social score'];

  for (let i = 0; i < n; i++) {
    const ang = (Math.PI * 2 / n) * i - Math.PI / 2;
    const x2 = cx + r * Math.cos(ang);
    const y2 = cy + r * Math.sin(ang);
    const line = createSvg('line', {
      x1: cx, y1: cy, x2: x2, y2: y2,
      stroke: theme.grid
    });
    svg.appendChild(line);

    const tx = cx + (r + 14) * Math.cos(ang);
    const ty = cy + (r + 14) * Math.sin(ang);

    const text = createSvg('text', {
      x: tx,
      y: ty + 3,
      'text-anchor': Math.abs(Math.cos(ang)) < 0.2 ? 'middle' : (Math.cos(ang) > 0 ? 'start' : 'end'),
      fill: theme.textLight,
      'font-size': '8.5px',
      'font-weight': '600'
    });
    text.textContent = baseLabels[i];
    svg.appendChild(text);
  }

  const colors = [theme.emerald, theme.blue, theme.amber];
  const fills = ['color-mix(in srgb, var(--accent) 18%, transparent)', 'color-mix(in srgb, var(--text-2) 14%, transparent)', 'color-mix(in srgb, var(--ok) 18%, transparent)'];

  targets.forEach((sup, idx) => {
    const peers = appState.data.suppliers.filter(p => p.category === sup.category);
    const span = (f, better) => {
      const vals = peers.map(p => p[f]);
      const lo = Math.min(...vals), hi = Math.max(...vals);
      if (hi === lo) return 100;
      return better === 'low' ? (hi - sup[f]) / (hi - lo) * 100 : (sup[f] - lo) / (hi - lo) * 100;
    };
    const criteria = [
      { val: span('cost_per_unit', 'low') },
      { val: span('co2_per_unit', 'low') },
      { val: span('transit_days', 'low') },
      { val: sup.social_score * 100 }
    ];

    const polyPts = [];
    criteria.forEach((c, i) => {
      const scoreRatio = Math.min(1.0, Math.max(0.1, c.val / 100));
      const ang = (Math.PI * 2 / n) * i - Math.PI / 2;
      polyPts.push(`${cx + r * scoreRatio * Math.cos(ang)},${cy + r * scoreRatio * Math.sin(ang)}`);
    });

    const radarShape = createSvg('polygon', {
      points: polyPts.join(' '),
      fill: fills[idx % colors.length],
      stroke: colors[idx % colors.length],
      'stroke-width': '2'
    });
    svg.appendChild(radarShape);

    criteria.forEach((c, i) => {
      const scoreRatio = Math.min(1.0, Math.max(0.1, c.val / 100));
      const ang = (Math.PI * 2 / n) * i - Math.PI / 2;
      const dot = createSvg('circle', {
        cx: cx + r * scoreRatio * Math.cos(ang),
        cy: cy + r * scoreRatio * Math.sin(ang),
        r: 3.5,
        fill: 'var(--text)',
        stroke: colors[idx % colors.length],
        'stroke-width': '1.5'
      });
      svg.appendChild(dot);
    });

    const legendTxt = createSvg('text', {
      x: 10,
      y: 15 + idx * 15,
      fill: colors[idx % colors.length],
      'font-size': '10px',
      'font-weight': '600'
    });
    legendTxt.textContent = sup.name;
    svg.appendChild(legendTxt);
  });

  container.appendChild(svg);
}
function renderSupplierTable() {
  const tbody = document.getElementById('supplier-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const sups = getFilteredSuppliers();
  const searchInput = document.getElementById('supplier-search');
  const term = searchInput ? (searchInput.value || '').toLowerCase().trim() : '';

  const filtered = sups.filter(s => {
    return s.name.toLowerCase().includes(term) ||
           s.category.toLowerCase().includes(term) ||
           s.country.toLowerCase().includes(term) ||
           s.location.toLowerCase().includes(term);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" class="empty-note">No suppliers match this search and region. Clear the search or change the region.</td></tr>';
    return;
  }

  filtered.forEach(s => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
        tr.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() !== 'button') {
        if (appState.compareMode) {
          if (appState.compareSelection.includes(s.id)) {
            appState.compareSelection = appState.compareSelection.filter(id => id !== s.id);
          } else if (appState.compareSelection.length < 3) {
            appState.compareSelection.push(s.id);
          }
          renderSupplierTable();
          renderRankingsBarChart();
        } else {
          appState.inspectedSupplier = s;
        }
        renderRadarChart();
      }
    });

    if (appState.compareMode && appState.compareSelection.includes(s.id)) {
      tr.classList.add('is-compared');
    }

    const rankCls = s.rank === 1 ? 'rank-1' : (s.rank === 2 ? 'rank-2' : (s.rank === 3 ? 'rank-3' : 'rank-other'));

    tr.innerHTML = `
      <td><span class="rank-badge ${rankCls}">${s.rank}</span></td>
      <td><strong>${s.name}</strong></td>
      <td>${s.category}</td>
      <td>${s.location} (${s.country})</td>
      <td class="num">$${s.cost_per_unit.toLocaleString()}</td>
      <td class="num">${s.co2_per_unit}</td>
      <td class="num">${s.transit_days} d</td>
      <td>${s.esg_tier}</td>
      <td>${(s.certifications || []).map(c => `<span class="cert-tag">${c}</span>`).join('')}</td>
      <td class="num strong">${s.topsis_score.toFixed(1)}</td>
      <td><button class="table-btn" data-sup-id="${s.id}">Inspect</button></td>
    `;
    
    const inspectBtn = tr.querySelector('.table-btn');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => {
        appState.selectedNodeId = s.id;
        appState.mapZoom = 1.7;
        const w = 940;
        const h = 480;
        const px = 50 + ((s.lon + 180) / 360) * (w - 80);
        const py = 30 + ((75 - s.lat) / 135) * (h - 60);
        appState.mapPanX = (w / 2) - px * 1.7;
        appState.mapPanY = (h / 2) - py * 1.7;
        navigateTo('page-network');
      });
    }

    tbody.appendChild(tr);
  });
}

function renderNetworkPage() {
  const container = document.getElementById('network-map');
  if (!container || !appState.data) return;

  const existingDetail = document.getElementById('map-node-detail');
  const detailSaved = existingDetail ? existingDetail.outerHTML : '<div id="map-node-detail" class="map-detail-card" style="display: none;"></div>';

  container.innerHTML = detailSaved;

  const w = container.clientWidth || 940;
  const h = 480;

  const svg = createSvg('svg', { viewBox: `0 0 ${w} ${h}`, class: 'svg-chart' });
  const viewport = createSvg('g', {
    id: 'map-viewport',
    transform: `translate(${appState.mapPanX}, ${appState.mapPanY}) scale(${appState.mapZoom})`
  });
  svg.appendChild(viewport);

  const isLight = document.body.classList.contains('light-theme');

  const btnWorld = document.getElementById('btn-map-mode-world');
  const btnGrid = document.getElementById('btn-map-mode-grid');
  if (btnWorld) btnWorld.classList.toggle('active', appState.mapViewMode === 'world');
  if (btnGrid) btnGrid.classList.toggle('active', appState.mapViewMode === 'grid');

  const projectCoord = (lat, lon) => {
    const px = 50 + ((lon + 180) / 360) * (w - 80);
    const py = 30 + ((75 - lat) / 135) * (h - 60);
    return { x: px, y: py };
  };

  const worldLandmasses = (appState.data && appState.data.world_map_polygons) || [];
  const worldShapes = worldLandmasses.concat((appState.data && appState.data.world_map_lakes) || []);

  if (appState.mapViewMode === 'world') {
    const ocean = createSvg('rect', {
      x: 10, y: 10, width: w - 20, height: h - 20,
      rx: 8,
      fill: 'var(--bg)',
      stroke: 'var(--line)',
      'stroke-width': '1'
    });
    viewport.appendChild(ocean);

    const eqY = projectCoord(0, 0).y;
    const eqLine = createSvg('line', {
      x1: 20, y1: eqY, x2: w - 20, y2: eqY,
      stroke: 'var(--line-strong)',
      'stroke-dasharray': '4,4'
    });
    viewport.appendChild(eqLine);

    const eqText = createSvg('text', {
      x: w - 24, y: eqY - 4,
      'text-anchor': 'end',
      fill: 'var(--muted)',
      'font-size': '7.5px',
      'font-family': 'Manrope, sans-serif'
    });
    eqText.textContent = 'EQUATOR 0 deg';
    viewport.appendChild(eqText);

    const pmX = projectCoord(0, 0).x;
    const pmLine = createSvg('line', {
      x1: pmX, y1: 20, x2: pmX, y2: h - 20,
      stroke: 'var(--line)',
      'stroke-dasharray': '4,4'
    });
    viewport.appendChild(pmLine);

    worldShapes.forEach((poly, k) => {
      let d = '';
      const wraps = poly.some((pt, i) => i && Math.abs(pt[0] - poly[i - 1][0]) > 300);
      poly.forEach((pt, i) => {
        const c = projectCoord(pt[1], wraps && pt[0] < -150 ? 180 : pt[0]);
        d += (i === 0 ? 'M' : 'L') + c.x.toFixed(1) + ',' + c.y.toFixed(1);
      });
      d += 'Z';
      const path = createSvg('path', {
        d: d,
        fill: k < worldLandmasses.length ? 'var(--surface)' : 'var(--bg)',
        stroke: 'var(--line-strong)',
        'stroke-width': '0.75'
      });
      viewport.appendChild(path);
    });

    const labels = [
      { text: 'NORTH AMERICA', lat: 48, lon: -100 },
      { text: 'SOUTH AMERICA', lat: -15, lon: -60 },
      { text: 'EUROPE', lat: 50, lon: 15 },
      { text: 'AFRICA', lat: 5, lon: 22 },
      { text: 'ASIA', lat: 45, lon: 90 },
      { text: 'OCEANIA', lat: -25, lon: 135 }
    ];
    labels.forEach(lbl => {
      const pt = projectCoord(lbl.lat, lbl.lon);
      const t = createSvg('text', {
        x: pt.x, y: pt.y,
        'text-anchor': 'middle',
        fill: 'var(--muted)',
        'font-size': '8.5px',
        'font-weight': '700',
        'letter-spacing': '1.5px',
        'font-family': 'Manrope, sans-serif'
      });
      t.textContent = lbl.text;
      viewport.appendChild(t);
    });
  } else {
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = projectCoord(lat, 0).y;
      const line = createSvg('line', {
        x1: 40, y1: y, x2: w - 30, y2: y,
        stroke: 'var(--line)',
        'stroke-dasharray': lat === 0 ? 'none' : '2,4',
        'stroke-width': lat === 0 ? '1.5' : '1'
      });
      viewport.appendChild(line);

      const txt = createSvg('text', {
        x: 35, y: y + 3,
        'text-anchor': 'end',
        fill: 'var(--muted)',
        'font-size': '8px',
        'font-family': 'Manrope, sans-serif'
      });
      txt.textContent = lat === 0 ? '0 deg (Eq)' : `${lat > 0 ? '+' : ''}${lat} deg`;
      viewport.appendChild(txt);
    }

    for (let lon = -120; lon <= 120; lon += 60) {
      const x = projectCoord(0, lon).x;
      const line = createSvg('line', {
        x1: x, y1: 30, x2: x, y2: h - 30,
        stroke: 'var(--line)',
        'stroke-dasharray': lon === 0 ? 'none' : '2,4',
        'stroke-width': lon === 0 ? '1.5' : '1'
      });
      viewport.appendChild(line);

      const txt = createSvg('text', {
        x: x, y: h - 16,
        'text-anchor': 'middle',
        fill: 'var(--muted)',
        'font-size': '8px',
        'font-family': 'Manrope, sans-serif'
      });
      txt.textContent = lon === 0 ? '0 deg (PM)' : `${lon > 0 ? '+' : ''}${lon} deg`;
      viewport.appendChild(txt);
    }

    worldShapes.forEach((poly, k) => {
      let d = '';
      const wraps = poly.some((pt, i) => i && Math.abs(pt[0] - poly[i - 1][0]) > 300);
      poly.forEach((pt, i) => {
        const c = projectCoord(pt[1], wraps && pt[0] < -150 ? 180 : pt[0]);
        d += (i === 0 ? 'M' : 'L') + c.x.toFixed(1) + ',' + c.y.toFixed(1);
      });
      d += 'Z';
      const path = createSvg('path', {
        d: d,
        stroke: 'var(--line-strong)',
        fill: 'none',
        'stroke-width': '0.75'
      });
      viewport.appendChild(path);
    });
  }

  const sups = appState.data.suppliers || [];
  const hubs = appState.data.demand_hubs || [];
  const corridors = appState.data.corridors || [];

  const supCoords = {};
  sups.forEach(s => {
    supCoords[s.id] = { ...projectCoord(s.lat, s.lon), data: s };
  });

  const hubCoords = {};
  hubs.forEach(hb => {
    hubCoords[hb.id] = { ...projectCoord(hb.lat, hb.lon), data: hb };
  });

  const connectedNodes = new Set();
  if (appState.selectedNodeId) {
    corridors.forEach(c => {
      if (c.source === appState.selectedNodeId) connectedNodes.add(c.target);
      if (c.target === appState.selectedNodeId) connectedNodes.add(c.source);
    });
  }

  corridors.forEach(c => {
    const src = supCoords[c.source];
    const tgt = hubCoords[c.target];
    if (!src || !tgt) return;

    const midX = (src.x + tgt.x) / 2;
    const midY = Math.min(src.y, tgt.y) - 25;

    const matchesFilter = appState.selectedFilters.has('All') ||
                          appState.selectedFilters.has(c.region) ||
                          appState.selectedFilters.has(c.country) ||
                          appState.selectedFilters.has(src.data.country) ||
                          appState.selectedFilters.has(tgt.data.country);

    const isConnected = (appState.selectedNodeId && (c.source === appState.selectedNodeId || c.target === appState.selectedNodeId));

    let strokeColor = 'color-mix(in srgb, var(--accent) 45%, transparent)';
    let strokeW = 1.0;
    let opacity = '0.35';

    if (appState.selectedNodeId) {
      if (isConnected) {
        strokeColor = 'var(--accent)';
        strokeW = 2.8;
        opacity = '1.0';
      } else {
        strokeColor = 'color-mix(in srgb, var(--text) 6%, transparent)';
        strokeW = 0.5;
        opacity = '0.05';
      }
    } else if (!matchesFilter) {
      strokeColor = 'color-mix(in srgb, var(--text) 10%, transparent)';
      strokeW = 0.6;
      opacity = '0.1';
    }

    const pathD = `M ${src.x} ${src.y} Q ${midX} ${midY} ${tgt.x} ${tgt.y}`;

    const path = createSvg('path', {
      d: pathD,
      fill: 'none',
      stroke: strokeColor,
      'stroke-width': strokeW,
      'stroke-opacity': opacity,
      style: 'cursor:pointer;'
    });

    path.addEventListener('mouseenter', (ev) => {
      path.setAttribute('stroke', 'var(--accent)');
      path.setAttribute('stroke-width', '3');
      showTooltip(ev, `
        <strong>Corridor: ${c.corridor}</strong><br>
        Mode: ${c.mode}<br>
        Distance: ${c.distance_km.toLocaleString()} km<br>
        Product: ${c.commodity}<br>
        Allocated flow: ${c.flow_tons.toLocaleString()} t a year<br>
        Freight emissions: ${c.ef_kg_per_tkm} kg CO2e/t-km well-to-wheel (${c.co2_kg_per_t} kg per t)<br>
        Status: ${c.status}
      `);
    });
    path.addEventListener('mouseleave', () => {
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-width', strokeW);
      hideTooltip();
    });

    viewport.appendChild(path);
  });

  for (const id in hubCoords) {
    const hNode = hubCoords[id];
    const matchesFilter = appState.selectedFilters.has('All') ||
                          appState.selectedFilters.has(hNode.data.region) ||
                          appState.selectedFilters.has(hNode.data.country);

    const isSelected = (appState.selectedNodeId === id);
    const isConn = connectedNodes.has(id);

    const dot = createSvg('circle', {
      cx: hNode.x,
      cy: hNode.y,
      r: isSelected ? 8 : (matchesFilter ? 6 : 3.5),
      fill: isSelected ? 'var(--text)' : (matchesFilter ? theme.emerald : 'color-mix(in srgb, var(--accent) 30%, transparent)'),
      stroke: 'var(--bg)',
      'stroke-width': isSelected ? 2.5 : (matchesFilter ? 1.5 : 0.6),
      style: 'cursor:pointer;'
    });

    dot.addEventListener('mouseenter', (ev) => {
      showTooltip(ev, `
        <strong>${hNode.data.name}</strong><br>
        Location: ${hNode.data.location_name} (${hNode.data.country})<br>
        Project: ${hNode.data.project_type}<br>
        Capacity: ${hNode.data.demand_annual_mw.toLocaleString()} MW (${hNode.data.demand_units.toLocaleString()} t of equipment a year)<br>
        Priority Tier: #${hNode.data.priority} (Click for corridor routes)
      `);
    });
    dot.addEventListener('mouseleave', hideTooltip);

    dot.addEventListener('click', (ev) => {
      ev.stopPropagation();
      appState.selectedNodeId = (appState.selectedNodeId === id) ? null : id;
      renderNetworkPage();
    });

    viewport.appendChild(dot);

    const isFilteredRegion = !appState.selectedFilters.has('All') && matchesFilter;
    if (isSelected || isConn || isFilteredRegion) {
      const lbl = createSvg('text', {
        x: hNode.x + 9,
        y: hNode.y + 3,
        fill: isSelected ? theme.textLight : theme.textDim,
        'font-size': isSelected ? '10px' : '8.5px',
        'font-weight': isSelected ? '700' : '600'
      });
      lbl.textContent = hNode.data.name.split(' ')[0];
      viewport.appendChild(lbl);
    }
  }

  for (const id in supCoords) {
    const sNode = supCoords[id];
    const matchesFilter = appState.selectedFilters.has('All') ||
                          appState.selectedFilters.has(sNode.data.region) ||
                          appState.selectedFilters.has(sNode.data.country);

    const isSelected = (appState.selectedNodeId === id);
    const isConn = connectedNodes.has(id);

    const dot = createSvg('circle', {
      cx: sNode.x,
      cy: sNode.y,
      r: isSelected ? 8 : (matchesFilter ? 6 : 3.5),
      fill: isSelected ? 'var(--text)' : (matchesFilter ? theme.blue : 'color-mix(in srgb, var(--text-2) 30%, transparent)'),
      stroke: 'var(--bg)',
      'stroke-width': isSelected ? 2.5 : (matchesFilter ? 1.5 : 0.6),
      style: 'cursor:pointer;'
    });

    dot.addEventListener('mouseenter', (ev) => {
      showTooltip(ev, `
        <strong>Supplier: ${sNode.data.name}</strong><br>
        Origin: ${sNode.data.location || sNode.data.location_name} (${sNode.data.country})<br>
        Category: ${sNode.data.category}<br>
        Capacity offered: ${sNode.data.capacity.toLocaleString()} t a year<br>
        TOPSIS rank in category: #${sNode.data.rank} (Click for corridor routes)
      `);
    });
    dot.addEventListener('mouseleave', hideTooltip);

    dot.addEventListener('click', (ev) => {
      ev.stopPropagation();
      appState.selectedNodeId = (appState.selectedNodeId === id) ? null : id;
      renderNetworkPage();
    });

    viewport.appendChild(dot);

    const isFilteredRegion = !appState.selectedFilters.has('All') && matchesFilter;
    if (isSelected || isConn || isFilteredRegion) {
      const lbl = createSvg('text', {
        x: sNode.x - 9,
        y: sNode.y - 3,
        'text-anchor': 'end',
        fill: isSelected ? theme.textLight : theme.textDim,
        'font-size': isSelected ? '10px' : '8.5px',
        'font-weight': isSelected ? '700' : '600'
      });
      lbl.textContent = sNode.data.name.split(' ')[0];
      viewport.appendChild(lbl);
    }
  }
  const ports = appState.data.telemetry || [];
  ports.forEach(port => {
    const p = projectCoord(port.lat, port.lon);
    
    const diamond = createSvg('polygon', {
      points: `${p.x},${p.y-4} ${p.x+4},${p.y} ${p.x},${p.y+4} ${p.x-4},${p.y}`,
      fill: 'var(--text-2)',
      stroke: '#000',
      'stroke-width': '1',
      class: 'node-interactive',
      'data-type': 'port',
      'data-id': port.port_id,
      style: 'cursor:pointer;'
    });
    
    diamond.addEventListener('click', (e) => {
      e.stopPropagation();
      openPortModal(port);
    });
    
    viewport.appendChild(diamond);
  });

  container.appendChild(svg);

  const detailCard = document.getElementById('map-node-detail');
  if (detailCard) {
    if (!appState.selectedNodeId) {
      detailCard.style.display = 'none';
    } else {
      let isSup = Boolean(supCoords[appState.selectedNodeId]);
      let node = isSup ? supCoords[appState.selectedNodeId].data : (hubCoords[appState.selectedNodeId] ? hubCoords[appState.selectedNodeId].data : null);
      if (!node) {
        const foundSup = (appState.data.suppliers || []).find(s => s.id === appState.selectedNodeId);
        if (foundSup) {
          node = foundSup;
          isSup = true;
        } else {
          const foundHub = (appState.data.demand_hubs || []).find(h => h.id === appState.selectedNodeId);
          if (foundHub) {
            node = foundHub;
            isSup = false;
          }
        }
      }
      if (node) {
        detailCard.style.display = 'flex';
        const connected = corridors.filter(c => c.source === node.id || c.target === node.id);
        const capVal = isSup ? ((node.capacity != null ? Number(node.capacity).toLocaleString() : '--') + ' t a year') : ((node.demand_annual_mw != null ? Number(node.demand_annual_mw).toLocaleString() : '1,200') + ' MW');
        const co2Val = isSup ? (node.co2_per_unit != null ? node.co2_per_unit + ' t CO2e/t' : '--') : ('Tier #' + (node.priority || 1));
        detailCard.innerHTML = `
          <div class="map-detail-head">
            <div>
              <div class="map-detail-title">${node.name}</div>
              <div style="font-size:0.72rem; color:${theme.textDim};">${node.location || node.location_name || ''} (${node.country || ''})</div>
            </div>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span class="map-detail-type">${isSup ? 'SUPPLIER' : 'DEMAND HUB'}</span>
              <button class="map-close-btn" id="btn-close-map-detail">&times;</button>
            </div>
          </div>
          <div class="map-detail-grid">
            <div class="map-detail-item">
              <span class="mdi-lbl">${isSup ? 'Capacity' : 'Annual Demand'}</span>
              <span class="mdi-val">${capVal}</span>
            </div>
            <div class="map-detail-item">
              <span class="mdi-lbl">${isSup ? 'CO2 Intensity' : 'Priority'}</span>
              <span class="mdi-val">${co2Val}</span>
            </div>
          </div>
          <div class="map-routes-list">
            <div class="map-routes-head">Connected routes (${connected.length})</div>
            ${connected.length > 0 ? connected.map(c => `
              <div class="mrl-item">
                <span>${c.corridor}</span>
                <span>${c.mode} | ${c.flow_tons != null ? Number(c.flow_tons).toLocaleString() : '1,500'}t</span>
              </div>
            `).join('') : `
              <div style="padding:0.4rem 0; font-size:0.72rem; color:${theme.textDim};">Direct regional logistics route active in supply network.</div>
            `}
          </div>
        `;
        const closeBtn = document.getElementById('btn-close-map-detail');
        if (closeBtn) {
          closeBtn.onclick = () => {
            appState.selectedNodeId = null;
            renderNetworkPage();
          };
        }
      }
    }
  }

  renderCorridorCards();
}

function renderCorridorCards() {
  const container = document.getElementById('corridors-grid');
  if (!container) return;
  container.innerHTML = '';

  const corridors = getFilteredCorridors();
  if (corridors.length === 0) {
    container.innerHTML = '<p class="empty-note">No corridors link to this region. Showing the global network.</p>';
    (appState.data.corridors || []).slice(0, 6).forEach(c => renderSingleCorridorCard(c, container));
    return;
  }

  corridors.forEach(c => renderSingleCorridorCard(c, container));
  
  renderIntermodalCarbonChart();
}

function renderSingleCorridorCard(c, container) {
  const card = document.createElement('div');
  card.className = 'corridor-card';
  card.innerHTML = `
    <div class="corridor-head">
      <span class="corridor-title">${c.corridor}</span>
      <span class="corridor-tag">${c.mode}</span>
    </div>
    <div class="corridor-stats">
      <div><span class="cs-label">Distance</span><strong>${c.distance_km.toLocaleString()} km</strong></div>
      <div><span class="cs-label">Annual flow</span><strong>${c.flow_tons.toLocaleString()} t</strong></div>
      <div><span class="cs-label">Emission factor</span><strong>${c.ef_kg_per_tkm} kg/t-km</strong></div>
      <div><span class="cs-label">Status</span><strong>${c.status}</strong></div>
    </div>
  `;
  container.appendChild(card);
}
function renderIntermodalCarbonChart() {
  const container = document.getElementById('intermodal-carbon-chart');
  if (!container) return;
  container.innerHTML = '';
  
  const corridors = getFilteredCorridors();
  if (corridors.length === 0) return;
  
  const getCategory = (c) => ({ sea_container: 'Container ship', rail: 'Freight rail', road_bev: 'Electric road', road_diesel: 'Diesel road' }[c.mode_class] || 'Diesel road');

  const catData = {
    'Container ship': { flow: 0, co2Sum: 0, color: theme.blue },
    'Freight rail': { flow: 0, co2Sum: 0, color: theme.emerald },
    'Electric road': { flow: 0, co2Sum: 0, color: theme.teal },
    'Diesel road': { flow: 0, co2Sum: 0, color: theme.amber }
  };
  
  corridors.forEach(c => {
    const cat = getCategory(c);
    catData[cat].flow += c.flow_tons;
    catData[cat].co2Sum += c.ef_kg_per_tkm * c.flow_tons;
  });
  
  const modes = Object.keys(catData).map(k => {
    const d = catData[k];
    return {
      mode: k,
      flow: d.flow,
      color: d.color,
      avgCo2: d.flow > 0 ? (d.co2Sum / d.flow).toFixed(3) : '0.000'
    };
  }).sort((a, b) => b.flow - a.flow);
  
  const w = container.clientWidth || 600;
  const h = 220;
  const svg = createSvg('svg', { viewBox: `0 0 ${w} ${h}`, class: 'svg-chart' });
  
  const padL = 140;
  const padR = 120;
  const padT = 16;
  const padB = 20;
  
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  
  const maxFlow = Math.max(...modes.map(m => m.flow), 1);
  const slotH = chartH / modes.length;
  
  modes.forEach((m, idx) => {
    const y = padT + idx * slotH + 6;
    const barH = 22;
    const barW = Math.max(12, (m.flow / maxFlow) * chartW);
    
    const lbl = createSvg('text', {
      x: padL - 12,
      y: y + 15,
      'text-anchor': 'end',
      fill: theme.textLight,
      'font-size': '11px',
      'font-weight': '600'
    });
    lbl.textContent = m.mode;
    svg.appendChild(lbl);
    
    const track = createSvg('rect', {
      x: padL,
      y: y,
      width: chartW,
      height: barH,
      fill: theme.grid,
      rx: 4
    });
    svg.appendChild(track);

    const bar = createSvg('rect', {
      x: padL,
      y: y,
      width: barW,
      height: barH,
      fill: m.color,
      rx: 4
    });
    svg.appendChild(bar);
    
    const statTxt = createSvg('text', {
      x: padL + barW + 10,
      y: y + 15,
      fill: theme.textLight,
      'font-size': '10.5px',
      'font-family': 'Manrope, sans-serif',
      'font-weight': '600'
    });
    statTxt.textContent = `${Math.round(m.flow).toLocaleString()} t | ${m.avgCo2} kg/t-km`;
    svg.appendChild(statTxt);
  });
  
  container.appendChild(svg);
}

function renderForecastPage() {
  syncForecastToggles();
  renderLstmForecastChart();
  renderRegionDemandChart();
  renderPriorityHubsRoster();
}

function renderPriorityHubsRoster() {
  const container = document.getElementById('hubs-roster');
  if (!container) return;
  container.innerHTML = '';

  const hubs = getFilteredHubs();
  if (hubs.length === 0) {
    container.innerHTML = '<p class="empty-note">No projects match this region. Choose another region.</p>';
    return;
  }

  hubs.forEach(h => {
    const card = document.createElement('div');
    card.className = 'hub-card';
    card.innerHTML = `
      <div class="hub-info">
        <div class="hub-name">${h.name}</div>
        <div class="hub-loc">${h.location_name} (${h.country}) - ${h.project_type}</div>
      </div>
      <div class="hub-demand">
        <div>${h.demand_annual_mw.toLocaleString()} MW</div>
        <div class="hub-priority">Priority tier ${h.priority}</div>
      </div>
    `;
    container.appendChild(card);
  });
}
function renderLstmForecastChart() {
  const container = document.getElementById('forecast-chart');
  if (!container || !appState.data || !appState.data.forecast) return;
  container.innerHTML = '';

  const fc = appState.data.forecast;

  const hubs = getFilteredHubs();
  const totalHubs = appState.data.demand_hubs || [];
  const filteredMw = hubs.reduce((sum, h) => sum + (h.demand_annual_mw || 0), 0);
  const totalMw = totalHubs.reduce((sum, h) => sum + (h.demand_annual_mw || 0), 0);
  const regionRatio = totalMw > 0 ? (filteredMw / totalMw) : 1.0;

  let scenarioMult = 1.0;
  if (appState.forecastScenario === 'accelerated') scenarioMult = 1.25;
  if (appState.forecastScenario === 'conservative') scenarioMult = 0.85;

  const hist = fc.historical_clean_units.map(v => Math.round(v * regionRatio));
  const pred = fc.model_forecast_units.map(v => Math.round(v * regionRatio * scenarioMult));
  const upper = fc.confidence_upper.map(v => Math.round(v * regionRatio * (scenarioMult > 1 ? scenarioMult * 1.08 : scenarioMult)));
  const lower = fc.confidence_lower.map(v => Math.round(v * regionRatio * (scenarioMult < 1 ? scenarioMult * 0.92 : scenarioMult)));

  const w = container.clientWidth || 500;
  const h = 260;
  const padL = 55;
  const padR = 25;
  const padT = 24;
  const padB = 34;

  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const allVals = hist.concat(upper);
  const minV = Math.min(...allVals) * 0.92;
  const maxV = Math.max(...allVals) * 1.05;

  const svg = createSvg('svg', { viewBox: `0 0 ${w} ${h}`, class: 'svg-chart' });

  for (let i = 0; i <= 4; i++) {
    const yVal = padT + (i / 4) * chartH;
    const v = maxV - (i / 4) * (maxV - minV);

    const line = createSvg('line', {
      x1: padL, y1: yVal, x2: w - padR, y2: yVal,
      stroke: theme.grid,
      'stroke-dasharray': '3,3'
    });
    svg.appendChild(line);

    const lbl = createSvg('text', {
      x: padL - 8, y: yVal + 4,
      'text-anchor': 'end',
      fill: theme.textDim,
      'font-size': '10px',
      'font-family': 'Manrope, sans-serif'
    });
    lbl.textContent = Math.round(v);
    svg.appendChild(lbl);
  }

  const yTitle = createSvg('text', {
    x: -h / 2 + 10,
    y: 15,
    transform: 'rotate(-90)',
    'text-anchor': 'middle',
    fill: theme.textDim,
    'font-size': '10px'
  });
  yTitle.textContent = 'Procurement Demand (MW / Day)';
  svg.appendChild(yTitle);

  const totalPts = hist.length + pred.length;
  const getX = (idx) => padL + (idx / (totalPts - 1)) * chartW;
  const getY = (val) => padT + ((maxV - val) / (maxV - minV)) * chartH;

  const bandPts = [];
  pred.forEach((p, i) => {
    const idx = hist.length + i;
    bandPts.push(`${getX(idx)},${getY(upper[i])}`);
  });
  for (let i = pred.length - 1; i >= 0; i--) {
    const idx = hist.length + i;
    bandPts.push(`${getX(idx)},${getY(lower[i])}`);
  }

  const confBand = createSvg('polygon', {
    points: bandPts.join(' '),
    fill: 'color-mix(in srgb, var(--accent) 12%, transparent)',
    stroke: 'none'
  });
  svg.appendChild(confBand);

  const histPts = hist.map((v, i) => `${getX(i)},${getY(v)}`);
  const histPath = createSvg('polyline', {
    points: histPts.join(' '),
    fill: 'none',
    stroke: theme.blue,
    'stroke-width': '2'
  });
  svg.appendChild(histPath);

  const splitX = getX(hist.length - 1);
  const splitLine = createSvg('line', {
    x1: splitX, y1: padT, x2: splitX, y2: padT + chartH,
    stroke: theme.textDim,
    'stroke-dasharray': '3,3'
  });
  svg.appendChild(splitLine);

  const predPts = [`${splitX},${getY(hist[hist.length - 1])}`];
  pred.forEach((v, i) => {
    predPts.push(`${getX(hist.length + i)},${getY(v)}`);
  });

  const predPath = createSvg('polyline', {
    points: predPts.join(' '),
    fill: 'none',
    stroke: theme.emerald,
    'stroke-width': '2.2',
    'stroke-dasharray': '4,3'
  });
  svg.appendChild(predPath);

  const xLine = createSvg('line', {
    x1: padL, y1: padT + chartH, x2: w - padR, y2: padT + chartH,
    stroke: theme.textDim
  });
  svg.appendChild(xLine);

  const xLabel = createSvg('text', {
    x: padL + chartW / 2,
    y: padT + chartH + 20,
    'text-anchor': 'middle',
    fill: theme.textDim,
    'font-size': '10px'
  });
  xLabel.textContent = `Scenario: ${appState.forecastScenario.toUpperCase()} | Regional Scale: ${Math.round(regionRatio * 100)}% of Global`;
  svg.appendChild(xLabel);

  const legendGroup = createSvg('g', {});
  legendGroup.innerHTML = `
    <line x1="${w - 240}" y1="12" x2="${w - 220}" y2="12" stroke="${theme.blue}" stroke-width="2"/>
    <text x="${w - 215}" y="15" fill="${theme.textDim}" font-size="9.5px">Historical</text>
    <line x1="${w - 150}" y1="12" x2="${w - 130}" y2="12" stroke="${theme.emerald}" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="${w - 125}" y="15" fill="${theme.textDim}" font-size="9.5px">Projection</text>
  `;
  svg.appendChild(legendGroup);

  container.appendChild(svg);
}
function renderRegionDemandChart() {
  const container = document.getElementById('region-demand-chart');
  if (!container || !appState.data || !appState.data.region_demand) return;
  container.innerHTML = '';

  const regions = appState.data.region_demand;
  const w = container.clientWidth || 500;
  const h = 260;
  const padL = 55;
  const padR = 25;
  const padT = 24;
  const padB = 38;

  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const maxVal = Math.max(...regions.map(r => r.demand_mw)) * 1.15;

  const svg = createSvg('svg', { viewBox: `0 0 ${w} ${h}`, class: 'svg-chart' });

  for (let i = 0; i <= 4; i++) {
    const yVal = padT + (i / 4) * chartH;
    const v = maxVal - (i / 4) * maxVal;

    const line = createSvg('line', {
      x1: padL, y1: yVal, x2: w - padR, y2: yVal,
      stroke: theme.grid,
      'stroke-dasharray': '3,3'
    });
    svg.appendChild(line);

    const lbl = createSvg('text', {
      x: padL - 8, y: yVal + 4,
      'text-anchor': 'end',
      fill: theme.textDim,
      'font-size': '10px',
      'font-family': 'Manrope, sans-serif'
    });
    lbl.textContent = Math.round(v);
    svg.appendChild(lbl);
  }

  const yTitle = createSvg('text', {
    x: -h / 2 + 10,
    y: 15,
    transform: 'rotate(-90)',
    'text-anchor': 'middle',
    fill: theme.textDim,
    'font-size': '10px'
  });
  yTitle.textContent = 'Cumulative Clean Capacity (MW)';
  svg.appendChild(yTitle);

  const n = regions.length;
  const slotW = chartW / n;
  const barW = slotW * 0.55;

  regions.forEach((r, idx) => {
    const x = padL + idx * slotW + (slotW - barW) / 2;
    const barH = (r.demand_mw / maxVal) * chartH;
    const y = padT + chartH - barH;

    const isMatch = appState.selectedFilters.has('All') || appState.selectedFilters.has(r.region);
    const color = isMatch ? theme.emerald : 'color-mix(in srgb, var(--accent) 30%, transparent)';

    const bar = createSvg('rect', {
      x: x,
      y: padT + chartH,
      width: barW,
      height: 0,
      rx: 3,
      fill: color,
      class: 'region-svg-bar',
      style: 'cursor:pointer;'
    });
    bar.dataset.targetY = y;
    bar.dataset.targetH = barH;

    bar.addEventListener('mouseenter', (ev) => {
      showTooltip(ev, `<strong>Region: ${r.region}</strong><br>Annual Demand: ${r.demand_mw.toLocaleString()} MW<br>Share: ${Math.round((r.demand_mw / maxVal) * 100)}% of Peak Capacity`);
    });
    bar.addEventListener('mouseleave', hideTooltip);

    svg.appendChild(bar);

    const valTxt = createSvg('text', {
      x: x + barW / 2,
      y: y - 5,
      'text-anchor': 'middle',
      fill: isMatch ? theme.textLight : theme.textDim,
      'font-size': '9.5px',
      'font-family': 'Manrope, sans-serif',
      'font-weight': '600'
    });
    valTxt.textContent = Math.round(r.demand_mw);
    svg.appendChild(valTxt);

    const lbl = createSvg('text', {
      x: x + barW / 2,
      y: padT + chartH + 16,
      'text-anchor': 'middle',
      fill: isMatch ? theme.textLight : theme.textDim,
      'font-size': '9.5px',
      'font-weight': '500'
    });
    lbl.textContent = r.region.length > 10 ? r.region.substring(0, 9) + '.' : r.region;
    svg.appendChild(lbl);
  });

  const xAxisLine = createSvg('line', {
    x1: padL, y1: padT + chartH, x2: w - padR, y2: padT + chartH,
    stroke: theme.textDim
  });
  svg.appendChild(xAxisLine);

  container.appendChild(svg);

  safeAnime({
    targets: container.querySelectorAll('.region-svg-bar'),
    y: (el) => parseFloat(el.dataset.targetY),
    height: (el) => parseFloat(el.dataset.targetH),
    delay: anime.stagger(40),
    duration: 650,
    easing: 'easeOutExpo'
  });
}

function renderScenariosPage() {
  renderParetoChart();
  renderScenarioDetails();
  renderRisk();
}

function renderRisk() {
  const r = appState.data && appState.data.risk;
  const box = document.getElementById('risk-stats');
  if (!box) return;
  if (!r) {
    box.innerHTML = '<p class="empty-note">The stochastic model has not been run. Rebuild the data with python model/build_data.py.</p>';
    return;
  }
  const m = v => '$' + Math.round(v / 1e6).toLocaleString() + 'M';
  const items = [
    ['Expected cost, robust plan', m(r.rp_expected_cost)],
    ['Expected cost, mean-demand plan', m(r.eev_expected_cost)],
    ['Value of the stochastic solution', m(r.vss)],
    ['Value of perfect information', r.evpi == null ? 'n/a' : m(r.evpi)],
    ['Worst 10% average cost, robust plan', m(r.rp_cvar90)],
    ['Worst 10% average cost, mean-demand plan', m(r.ev_cvar90)]
  ];
  box.innerHTML = items.map(([k, v]) => `<div class="scenario-stat-item"><span class="sc-stat-label">${k}</span><span class="sc-stat-val">${v}</span></div>`).join('');
  const hubs = [...new Set(Object.keys(r.ev_unmet_prob_by_hub).concat(Object.keys(r.rp_unmet_prob_by_hub)))];
  const pct = v => Math.round(100 * (v || 0)) + '%';
  document.getElementById('risk-tbody').innerHTML = hubs.length
    ? hubs.slice(0, 8).map(h => `<tr><td>${h}</td><td class="num">${pct(r.rp_unmet_prob_by_hub[h])}</td><td class="num">${pct(r.ev_unmet_prob_by_hub[h])}</td></tr>`).join('')
    : '<tr><td colspan="3" class="empty-note">No project is short in any sampled future.</td></tr>';
}

function renderParetoChart() {
  const container = document.getElementById('pareto-chart');
  if (!container || !appState.data || !appState.data.pareto) return;
  container.innerHTML = '';

  const hubs = getFilteredHubs();
  const totalHubs = appState.data.demand_hubs || [];
  const filteredMw = hubs.reduce((sum, h) => sum + (h.demand_annual_mw || 0), 0);
  const totalMw = totalHubs.reduce((sum, h) => sum + (h.demand_annual_mw || 0), 0);
  const ratio = 1;

  const pts = appState.data.pareto.map(p => ({
    ...p,
    cost: Math.round(p.cost * ratio),
    co2: Math.round(p.co2 * ratio)
  }));

  const w = container.clientWidth || 500;
  const h = 260;
  const padL = 84;
  const padR = 25;
  const padT = 24;
  const padB = 36;

  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const minCost = Math.min(...pts.map(p => p.cost));
  const maxCost = Math.max(...pts.map(p => p.cost));
  const minCo2 = Math.min(...pts.map(p => p.co2));
  const maxCo2 = Math.max(...pts.map(p => p.co2));

  const svg = createSvg('svg', { viewBox: `0 0 ${w} ${h}`, class: 'svg-chart' });

  for (let i = 0; i <= 4; i++) {
    const yVal = padT + (i / 4) * chartH;
    const co2Val = maxCo2 - (i / 4) * (maxCo2 - minCo2);

    const line = createSvg('line', {
      x1: padL, y1: yVal, x2: w - padR, y2: yVal,
      stroke: theme.grid,
      'stroke-dasharray': '3,3'
    });
    svg.appendChild(line);

    const lbl = createSvg('text', {
      x: padL - 8, y: yVal + 4,
      'text-anchor': 'end',
      fill: theme.textDim,
      'font-size': '10px',
      'font-family': 'Manrope, sans-serif'
    });
    lbl.textContent = Math.round(co2Val / 1000).toLocaleString() + ' kt';
    svg.appendChild(lbl);
  }

  for (let i = 0; i <= 4; i++) {
    const xVal = padL + (i / 4) * chartW;
    const costVal = minCost + (i / 4) * (maxCost - minCost);

    const lbl = createSvg('text', {
      x: xVal, y: padT + chartH + 14,
      'text-anchor': 'middle',
      fill: theme.textDim,
      'font-size': '9.5px',
      'font-family': 'Manrope, sans-serif'
    });
    lbl.textContent = '$' + Math.round(costVal / 1e6).toLocaleString() + 'M';
    svg.appendChild(lbl);
  }

  const yTitle = createSvg('text', {
    x: -h / 2 + 10,
    y: 15,
    transform: 'rotate(-90)',
    'text-anchor': 'middle',
    fill: theme.textDim,
    'font-size': '10px'
  });
  yTitle.textContent = 'CO2e a year (products plus freight)';
  svg.appendChild(yTitle);

  const xTitle = createSvg('text', {
    x: padL + chartW / 2,
    y: padT + chartH + 26,
    'text-anchor': 'middle',
    fill: theme.textDim,
    'font-size': '10px'
  });
  xTitle.textContent = 'Procurement and freight cost a year (USD)';
  svg.appendChild(xTitle);

  const pathCoords = pts.map(p => {
    const x = padL + ((p.cost - minCost) / (maxCost - minCost || 1)) * chartW;
    const y = padT + ((maxCo2 - p.co2) / (maxCo2 - minCo2 || 1)) * chartH;
    return `${x},${y}`;
  });

  const curve = createSvg('polyline', {
    points: pathCoords.join(' '),
    fill: 'none',
    stroke: 'var(--line-strong)',
    'stroke-width': '2',
    'stroke-dasharray': '4,3'
  });
  svg.appendChild(curve);

  const selectedIdx = appState.selectedScenario;

  pts.forEach((p, idx) => {
    const x = padL + ((p.cost - minCost) / (maxCost - minCost || 1)) * chartW;
    const y = padT + ((maxCo2 - p.co2) / (maxCo2 - minCo2 || 1)) * chartH;

    const isNamed = idx < 5;
    const isSelected = idx === selectedIdx;

    const circle = createSvg('circle', {
      cx: x,
      cy: y,
      r: isSelected ? 8 : (isNamed ? 5.5 : 3.5),
      fill: isSelected ? 'var(--accent)' : (isNamed ? theme.blue : 'var(--muted)'),
      stroke: 'var(--bg)',
      'stroke-width': isSelected ? 2.5 : 1,
      style: 'cursor:pointer;'
    });

    circle.addEventListener('mouseenter', (ev) => {
      showTooltip(ev, `
        <strong>${p.strategy}</strong><br>
        Freight Cost: $${p.cost.toLocaleString()}<br>
        Scope 3 Carbon: ${p.co2.toLocaleString()} tCO2e<br>
        Logistics Mode: ${p.mode}
      `);
    });
    circle.addEventListener('mouseleave', hideTooltip);

    circle.addEventListener('click', () => {
      document.querySelectorAll('.scenario-pill').forEach((b, bi) => {
        b.classList.toggle('active', +b.dataset.scenario === idx);
      });
      appState.selectedScenario = idx;
      renderScenariosPage();
    });

    svg.appendChild(circle);
  });

  container.appendChild(svg);
}

function renderScenarioDetails() {
  const container = document.getElementById('scenario-details');
  if (!container || !appState.data || !appState.data.pareto) return;

  const hubs = getFilteredHubs();
  const totalHubs = appState.data.demand_hubs || [];
  const filteredMw = hubs.reduce((sum, h) => sum + (h.demand_annual_mw || 0), 0);
  const totalMw = totalHubs.reduce((sum, h) => sum + (h.demand_annual_mw || 0), 0);
  const ratio = 1;

  const pts = appState.data.pareto;
  const sc = pts[appState.selectedScenario] || pts[0];

  const scaledCost = Math.round(sc.cost * ratio);
  const scaledCo2 = Math.round(sc.co2 * ratio);

  container.innerHTML = `
    <div class="scenario-strategy-name">${sc.strategy}</div>
    <div class="scenario-stats-grid">
      <div class="scenario-stat-item">
        <span class="sc-stat-label">Cost a year</span>
        <span class="sc-stat-val">$${Math.round(scaledCost / 1e6).toLocaleString()}M</span>
      </div>
      <div class="scenario-stat-item">
        <span class="sc-stat-label">CO2e a year</span>
        <span class="sc-stat-val">${Math.round(scaledCo2 / 1000).toLocaleString()} kt</span>
      </div>
      <div class="scenario-stat-item">
        <span class="sc-stat-label">Social score</span>
        <span class="sc-stat-val">${sc.social.toFixed(3)}</span>
      </div>
      <div class="scenario-stat-item">
        <span class="sc-stat-label">Primary mode</span>
        <span class="sc-stat-val sc-stat-text">${sc.mode.split(' ')[0]}</span>
      </div>
    </div>
    <div class="sc-desc">${sc.description || 'Trade-off point between procurement cost and emissions.'}</div>
  `;
  
  renderScenarioMatrix(ratio);
}

function renderScenarioMatrix(ratio) {
  const tbody = document.getElementById('scenario-matrix-tbody');
  if (!tbody || !appState.data || !appState.data.pareto) return;
  
  tbody.innerHTML = '';
  const all = appState.data.pareto;
  const pts = all.filter(p => p.role);

  pts.forEach((sc) => {
    const idx = all.indexOf(sc);
    const isSelected = (idx === appState.selectedScenario);
    const scaledCost = Math.round(sc.cost * ratio);
    const scaledCo2 = Math.round(sc.co2 * ratio);
    
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    if (isSelected) {
      tr.classList.add('is-compared');
      tr.style.borderLeft = `3px solid ${theme.emerald}`;
    }
    
    tr.innerHTML = `
      <td><strong>${sc.strategy}</strong></td>
      <td class="num strong">$${Math.round(scaledCost / 1e6).toLocaleString()}M</td>
      <td class="num strong">${Math.round(scaledCo2 / 1000).toLocaleString()} kt</td>
      <td><span class="mode-badge">${sc.mode}</span></td>
      <td><div class="desc-cell">${sc.description || ''}</div></td>
    `;
    tr.addEventListener('click', () => {
      document.querySelectorAll('.scenario-pill').forEach((b, bi) => {
        b.classList.toggle('active', +b.dataset.scenario === idx);
      });
      appState.selectedScenario = idx;
      renderScenariosPage();
    });
    tbody.appendChild(tr);
  });
}
function createSvg(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) {
    el.setAttribute(k, attrs[k]);
  }
  return el;
}

function showTooltip(e, html) {
  const tip = document.getElementById('chart-tooltip');
  if (!tip) return;
  tip.innerHTML = html;
  tip.style.left = (e.clientX + 14) + 'px';
  tip.style.top = (e.clientY + 14) + 'px';
  tip.style.opacity = '1';
}

function hideTooltip() {
  const tip = document.getElementById('chart-tooltip');
  if (!tip) return;
  tip.style.opacity = '0';
}

function setupPortModal() {
  const modal = document.getElementById('port-modal');
  const closeBtn = document.getElementById('port-modal-close');
  const closeSecBtn = document.getElementById('port-modal-btn-close');
  const networkBtn = document.getElementById('port-modal-btn-network');

  if (modal) {
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }
    if (closeSecBtn) {
      closeSecBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }

  if (networkBtn) {
    networkBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
      const port = appState.activePortModal;
      if (port && port.lat !== undefined && port.lon !== undefined) {
        const container = document.getElementById('network-map');
        const w = (container && container.clientWidth) ? container.clientWidth : 940;
        const h = 480;
        const targetX = 50 + ((port.lon + 180) / 360) * (w - 80);
        const targetY = 30 + ((75 - port.lat) / 135) * (h - 60);
        appState.mapZoom = 1.7;
        appState.mapPanX = (w / 2) - (targetX * appState.mapZoom);
        appState.mapPanY = (h / 2) - (targetY * appState.mapZoom);
      }
      document.querySelectorAll('.nav-item').forEach(b => {
        b.classList.toggle('active', b.dataset.target === 'page-network');
      });
      navigateTo('page-network');
    });
  }
}

function openPortModal(port) {
  const modal = document.getElementById('port-modal');
  if (!modal || !port) return;

  appState.activePortModal = port;

  const badgeEl = document.getElementById('port-modal-badge');
  const titleEl = document.getElementById('port-modal-title');
  const windEl = document.getElementById('port-modal-wind');
  const tempEl = document.getElementById('port-modal-temp');
  const riskEl = document.getElementById('port-modal-risk');
  const statusEl = document.getElementById('port-modal-status');
  const coordsEl = document.getElementById('port-modal-coords');
  const bufferEl = document.getElementById('port-modal-buffer');
  const routesContainer = document.getElementById('port-modal-routes');

  if (badgeEl) badgeEl.textContent = `${port.country} | ${port.region} | ${port.hub_type}`;
  if (titleEl) titleEl.textContent = port.port;
  if (windEl) windEl.textContent = `${port.windspeed_kmh} km/h`;
  if (tempEl) tempEl.textContent = `${port.temperature_c} deg C`;
  if (riskEl) {
    riskEl.textContent = `${port.delay_risk} Risk`;
    riskEl.style.color = port.delay_risk === 'Low' ? 'var(--good)' : 'var(--warn)';
  }
  if (statusEl) statusEl.textContent = port.status;
  if (coordsEl) {
    const latStr = port.lat >= 0 ? `${port.lat.toFixed(2)} deg N` : `${Math.abs(port.lat).toFixed(2)} deg S`;
    const lonStr = port.lon >= 0 ? `${port.lon.toFixed(2)} deg E` : `${Math.abs(port.lon).toFixed(2)} deg W`;
    coordsEl.textContent = `${latStr}, ${lonStr}`;
  }
  if (bufferEl) {
    bufferEl.textContent = port.delay_risk === 'Low' ? 'Nominal (0.0h transit buffer)' : 'Advisory (+4.5h berthing delay buffer)';
  }

  if (routesContainer && appState.data && appState.data.corridors) {
    routesContainer.innerHTML = '';
    const matchingCorridors = appState.data.corridors.filter(c => {
      const cName = c.corridor.toLowerCase();
      const pName = port.port.toLowerCase();
      const distincts = ['jebel ali', 'rotterdam', 'houston', 'yokohama', 'shanghai', 'singapore', 'los angeles', 'hamburg', 'antwerp', 'dubai'];
      let matchStr = pName;
      for (const d of distincts) {
        if (pName.includes(d)) matchStr = d;
      }
      const nameMatch = cName.includes(matchStr);
      const geoMatch = (c.country === port.country || c.region === port.region);
      return nameMatch && geoMatch;
    });

    const displayCorridors = matchingCorridors.slice(0, 4);
    if (displayCorridors.length === 0) {
      routesContainer.innerHTML = '<p class="empty-note">No corridors are assigned to this terminal.</p>';
    } else {
      displayCorridors.forEach(c => {
        const item = document.createElement('div');
        item.className = 'port-route-item';
        item.innerHTML = `
          <div class="port-route-name">
            <span>${c.corridor}</span>
            <span class="port-route-mode">${c.mode}</span>
          </div>
          <div class="port-route-stats">
            <span class="port-route-flow">${c.flow_tons.toLocaleString()} t/yr</span>
            <span class="port-route-dist">${c.distance_km.toLocaleString()} km</span>
          </div>
        `;
        routesContainer.appendChild(item);
      });
    }
  }

  modal.classList.add('active');
}
