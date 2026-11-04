const { chromium } = require('playwright-core');
const assert = require('assert');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const errs = [];
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:8765/', { waitUntil: 'load' });
    await p.click('#methods-open');
    await p.waitForSelector('#doc-body h2');
    assert.equal(await p.getAttribute('.top-nav [data-go=methods]', 'aria-current'), 'page', 'nav marks methods');
    const n = await p.evaluate(() => ({ h2: document.querySelectorAll('#doc-body h2').length, toc: document.querySelectorAll('#doc-toc a').length, tables: document.querySelectorAll('#doc-body table').length, h1: document.querySelector('#doc-body h1').textContent }));
    console.log(w, JSON.stringify(n));
    assert.ok(n.h2 >= 10 && n.toc === n.h2 && n.tables >= 6, 'report rendered');
    await p.click('#doc-toc a:nth-child(7)'); await p.waitForTimeout(2200);
    const pos = await p.evaluate(() => { const h = document.querySelectorAll('#doc-body h2')[6]; return { top: Math.round(h.getBoundingClientRect().top), focus: document.activeElement === h, cur: document.querySelector('#doc-toc a[aria-current]') && document.querySelector('#doc-toc a[aria-current]').textContent }; });
    console.log(w, 'jump', JSON.stringify(pos));
    assert.ok(pos.top < 200 && pos.focus, 'section link scrolls to its heading');
    if (w > 1000) assert.equal(pos.cur, 'Results', 'current section is marked');
    await p.screenshot({ path: __dirname + '/shots/methods-' + w + '.png' });
    await p.close();
  }
  const fs = require('fs'), path = require('path');
  const root = path.resolve(__dirname, '..');
  const md = fs.readFileSync(path.join(root, 'docs', 'METHODS.md'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'docs', 'methods.js'), 'utf8');
  assert.equal(JSON.parse(js.slice(js.indexOf('=') + 1, js.lastIndexOf(';'))), md, 'docs/methods.js is out of date: run python model/build_data.py --docs-only');
  const f = await b.newPage();
  f.on('pageerror', e => errs.push('file: ' + e.message));
  await f.goto(require('url').pathToFileURL(path.join(root, 'index.html')).href + '#methods', { waitUntil: 'load' });
  await f.waitForSelector('#methods-view.active #doc-body h2', { timeout: 5000 });
  console.log('file:// h2', await f.$$eval('#doc-body h2', n => n.length));
  const d = await b.newPage();
  await d.goto('http://127.0.0.1:8765/#methods', { waitUntil: 'load' });
  await d.waitForSelector('#methods-view.active #doc-body h2');
  console.log('errors', JSON.stringify(errs)); assert.equal(errs.length, 0);
  await b.close(); console.log('METHODS OK');
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
