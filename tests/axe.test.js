const { chromium } = require('playwright-core');
const fs = require('fs');
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const all = {};
  for (const theme of ['dark', 'light']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
    await p.addInitScript(t => { localStorage.setItem('nexus.theme', t); ['lab','routing'].forEach(k => localStorage.setItem('nexus_' + k + '_tutorial_seen', '1')); }, theme);
    await p.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle' });
    for (const v of ['hub', 'lab', 'routing', 'methods']) {
      await p.click(`.top-nav [data-go=${v}]`); await p.waitForTimeout(700);
      if (v === 'lab') await p.waitForSelector('#lab-out:not([hidden])', { timeout: 60000 });
      await p.evaluate(axeSrc);
      const r = await p.evaluate(async () => { const res = await axe.run(document.querySelector('.view.active'), { resultTypes: ['violations'], rules: { region: { enabled: false } } }); return res.violations.map(x => ({ id: x.id, impact: x.impact, n: x.nodes.length, sample: x.nodes.slice(0, 3).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n')[1]) })); });
      r.forEach(x => { const k = theme + ' ' + v + ' ' + x.id; all[k] = x; });
    }
    await p.close();
  }
  for (const [k, x] of Object.entries(all)) console.log(k, x.impact, x.n, '\n   ', x.sample.join('\n    '));
  console.log('total rule hits', Object.keys(all).length);
  await b.close();
})();
