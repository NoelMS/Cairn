const { chromium } = require('playwright-core');
const assert = require('assert');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('nexus_lab_tutorial_seen', '1'); localStorage.removeItem('nexus.weights'); localStorage.setItem('nexus_routing_tutorial_seen', '1'); });
  await p.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle' });
  await p.click('.top-nav [data-go=lab]'); await p.waitForTimeout(300);
  const set = async (k, v) => p.$eval('#lab-w-' + k, (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await set('env', 0); await set('soc', 0); await set('eco', 100);
  await p.click('.top-nav [data-go=routing]'); await p.waitForTimeout(500);
  const rw = await p.$eval('#rt-w-eco-v', e => e.textContent); console.log('routing eco weight shows', rw);
  assert.equal(rw, '100%', 'lab weights carry over to routing');

  await p.goto('http://127.0.0.1:8765/greenchainml/index.html', { waitUntil: 'networkidle' });
  await p.click('.nav-item[data-target=page-suppliers]'); await p.waitForTimeout(400);
  const slide = async (id, v) => p.$eval('#' + id, (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await slide('sl-co2', 0); await slide('sl-time', 0); await slide('sl-social', 0); await slide('sl-cost', 80);
  const rows = await p.$$eval('#supplier-tbody tr', n => n.map(r => { const c = r.querySelectorAll('td'); return { rank: +c[0].textContent, cat: c[2].textContent, cost: +c[4].textContent.replace(/[$,]/g, '') }; }));
  const cats = [...new Set(rows.map(r => r.cat))];
  console.log('categories', cats.length, 'rows', rows.length);
  assert.ok(cats.length >= 5, 'five product categories');
  for (const c of cats) {
    const g = rows.filter(r => r.cat === c);
    assert.deepStrictEqual(g.map(r => r.rank), g.map((_, i) => i + 1), 'ranks restart in ' + c);
    assert.equal(g[0].cost, Math.min(...g.map(r => r.cost)), 'cost-only weights put the cheapest first in ' + c);
  }
  console.log('errors', JSON.stringify(errs)); assert.equal(errs.length, 0);
  await b.close(); console.log('MCDM OK');
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
