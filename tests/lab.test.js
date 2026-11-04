const { chromium } = require('playwright-core');
const assert = require('assert');
const path = require('path');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const post = async body => {
    const r = await fetch('http://127.0.0.1:8765/api/solve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return r.status;
  };
  assert.strictEqual(await post({ scenario: { carbon_price: -5 } }), 400, 'negative carbon price rejected');
  assert.strictEqual(await post({ scenario: { disabled_suppliers: ['NOPE'] } }), 400, 'unknown supplier rejected');
  assert.strictEqual(await post({ scenario: { demand_scale: { UAE: 9 } } }), 400, 'demand scale range enforced');
  assert.strictEqual(await post({ scenario: { teleport: true } }), 400, 'unknown field rejected');
  assert.strictEqual(await post('x'), 400, 'non-object body rejected');

  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
  await p.addInitScript(() => { localStorage.setItem('nexus.theme', 'dark'); });
  await p.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle' });
  await p.click('.top-nav [data-go=lab]');
  await p.waitForTimeout(400);
  assert.ok(await p.isVisible('#lab-tutorial'), 'guide shows the first time');
  await p.screenshot({ path: __dirname + '/shots/lab-tutorial.png' });
  await p.click('#lab-tut-start');
  await p.waitForSelector('#lab-out:not([hidden])', { timeout: 60000 });
  const n = await p.$$eval('#lab-front circle.scn', e => e.length);
  assert.ok(n >= 3, 'front has 3 or more plans: ' + n);
  const baseCost = await p.textContent('#lab-hud-cost');
  assert.match(await p.textContent('#lab-changes'), /No change/, 'baseline against itself has no change');

  await p.locator('#lab-presets .rt-chip', { hasText: 'Asian module shock' }).click();
  await p.waitForFunction(() => /Solved/.test(document.querySelector('#lab-status').textContent) && !document.querySelector('#lab-results').hasAttribute('aria-busy'), null, { timeout: 60000 });
  assert.notStrictEqual(await p.textContent('#lab-hud-cost'), baseCost, 'cost moved');
  const changes = await p.$$eval('#lab-changes li', e => e.map(x => x.textContent));
  assert.ok(changes.some(c => /dropped/.test(c)), 'what changed lists dropped suppliers: ' + changes.join(' | '));
  assert.ok(await p.isVisible('#lab-changes .lab-warn'), 'unmet demand is flagged as not like for like');
  assert.strictEqual(await p.isChecked('#lab-sups input[data-s=SUP_LONGI]'), false, 'preset unticks LONGi');
  await p.fill('#lab-save-name', 'Module shock');
  await p.click('#lab-save');
  await p.screenshot({ path: __dirname + '/shots/lab-shock.png', fullPage: false });

  await p.locator('#lab-presets .rt-chip', { hasText: 'Carbon price' }).click();
  await p.waitForFunction(() => /Solved/.test(document.querySelector('#lab-status').textContent) && !document.querySelector('#lab-results').hasAttribute('aria-busy'), null, { timeout: 60000 });
  assert.strictEqual(await p.getAttribute('.lab-view-btn[data-v=cheapest]', 'aria-pressed'), 'true', 'cheapest plan is the default comparison');
  assert.match(await p.textContent('#lab-kpis'), /Carbon charge/, 'carbon charge shown');
  assert.match(await p.textContent('#lab-kpis'), /\$\d+\/t/, 'cost per tonne avoided shown');
  await p.click('#lab-save');
  const rows = await p.$$eval('#lab-saved tbody tr', e => e.length);
  assert.strictEqual(rows, 3, 'baseline plus two saved scenarios');

  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#lab-csv')]);
  const csv = require('fs').readFileSync(await dl.path(), 'utf8');
  assert.ok(csv.split('\n').length > 10 && /^corridor,product,mode/.test(csv), 'csv export');

  await p.check('#lab-stoch');
  await p.click('#lab-reset');
  await p.waitForSelector('#lab-risk:not([hidden])', { timeout: 120000 });
  assert.ok(await p.$$eval('#lab-hist rect', e => e.length) >= 10, 'histogram drawn');
  assert.match(await p.textContent('#lab-risk-kpis'), /Value of the stochastic solution/);
  await p.screenshot({ path: __dirname + '/shots/lab-risk.png', fullPage: false });

  await p.click('#lab-sups input[data-s=SUP_VESTAS]');
  assert.match(await p.textContent('#lab-status'), /Press Solve/, 'manual change asks for a solve');

  const f = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await f.goto('file:///' + path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/'));
  await f.click('.top-nav [data-go=lab]');
  await f.click('#lab-tut-start');
  assert.ok(await f.isVisible('#lab-offline'), 'file:// explains the server is needed');
  assert.ok(await f.isDisabled('#lab-solve'), 'solve disabled on file://');

  assert.deepStrictEqual(errs, [], 'console errors: ' + errs.join('\n'));
  await b.close();
  console.log('LAB OK');
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
