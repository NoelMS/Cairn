const { chromium } = require('playwright-core');
const out = process.argv[2] || __dirname + '/shots';
const base = 'http://127.0.0.1:8765/';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = [], problems = [];
  for (const theme of ['dark', 'light']) {
    for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, colorScheme: theme });
      const page = await ctx.newPage();
      const errs = [];
      page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
      page.on('pageerror', e => errs.push('pageerror: ' + e.message));
      await page.addInitScript(t => localStorage.setItem('nexus.theme', t), theme);
      await page.goto(base, { waitUntil: 'networkidle' });
      const tag = `${theme}-${vp.w}`;
      await page.screenshot({ path: `${out}/${tag}-hub.png` });
      const rows = await page.$$('.starts .btn-play');
      for (let i = 0; i < rows.length; i++) {
        await rows[i].hover();
        await page.waitForTimeout(350);
        const st = await rows[i].evaluate(e => { const c = getComputedStyle(e); return { bg: c.backgroundColor, color: c.color }; });
        report.push(`${tag} hover row ${i}: bg=${st.bg} color=${st.color}`);
        if (i === 0) await page.screenshot({ path: `${out}/${tag}-hub-hover.png` });
      }
      const ov = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth || [...document.querySelectorAll('.view.active *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 5).map(e => e.className || e.tagName));
      report.push(`${tag} hub overflow: ${JSON.stringify(ov)}`);
      for (const v of ['lab', 'routing', 'dashboard', 'methods']) {
        await page.click(`.top-nav [data-go=${v}]`);
        await page.waitForTimeout(900);
        if (v === 'lab') await page.waitForSelector('#lab-out:not([hidden])', { state: 'attached', timeout: 60000 });
        await page.screenshot({ path: `${out}/${tag}-${v}.png` });
        const off = await page.evaluate(() => [...document.querySelectorAll('.view.active *')].filter(e => { if (e.closest('svg')) return false; for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { if (getComputedStyle(a).overflowX !== 'visible') return false; } const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 4).map(e => e.id || e.className));
        report.push(`${tag} ${v} offscreen: ${JSON.stringify(off)}`);
        const bars = await page.evaluate(() => [...document.querySelectorAll('*')].filter(e => { const c = getComputedStyle(e); if (!/(auto|scroll)/.test(c.overflowX + c.overflowY) || c.display === 'none') return false; const bw = parseFloat(c.borderLeftWidth) + parseFloat(c.borderRightWidth); return (e.offsetWidth - e.clientWidth - bw) > 0; }).map(e => e.id || e.className).slice(0, 5));
        report.push(`${tag} ${v} visible scrollbars: ${JSON.stringify(bars)}`);
        if (bars.length) problems.push(`${tag} ${v} scrollbars ${JSON.stringify(bars)}`);
        if (off.length) problems.push(`${tag} ${v} offscreen ${JSON.stringify(off)}`);
        if (await page.isVisible('.view.active .tutorial-box')) {
          const tb = await page.evaluate(() => { const e = document.querySelector('.view.active .tutorial-body-scroll'); return e ? e.offsetWidth - e.clientWidth : -1; });
          report.push(`${tag} ${v} tutorial scrollbar px: ${tb}`);
        }
        await page.keyboard.press('Escape');
      }
      report.push(`${tag} console: ${JSON.stringify(errs)}`);
      if (errs.filter(e => !/fonts\.g/.test(e)).length) problems.push(`${tag} console errors`);
      await ctx.close();
    }
  }
  await browser.close();
  console.log(report.join('\n'));
  if (problems.length) { console.error('FAIL', problems.join('; ')); process.exit(1); }
  console.log('AUDIT OK');
})();
