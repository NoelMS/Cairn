const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  let bad = 0;
  await p.goto('http://127.0.0.1:8765/', { waitUntil: 'load' });
  for (const [v, btn] of [['lab', '#lab-tut-demo'], ['routing', '#rt-tut-demo']]) {
    await p.click('.top-nav [data-go=hub]'); await p.waitForTimeout(300);
    await p.click(`.top-nav [data-go=${v}]`); await p.waitForTimeout(600);
    if (!(await p.isVisible(btn))) { await p.click('.view.active .hud-tutorial-btn').catch(() => {}); await p.waitForTimeout(300); }
    await p.click(btn); await p.waitForTimeout(1800);
    const st = await p.evaluate(() => { const v = document.querySelector('#demo-video'); return { open: !document.querySelector('#demo-overlay').classList.contains('hidden'), t: v.currentTime, dur: v.duration, err: !!v.error, src: v.getAttribute('src'), focus: document.activeElement.id, native: v.hasAttribute('controls'), time: document.querySelector('#dv-time').textContent }; });
    await p.click('#dv-play'); await p.waitForTimeout(150);
    const paused = await p.evaluate(() => document.querySelector('#demo-video').paused && document.querySelector('#dv-play').getAttribute('aria-label') === 'Play');
    await p.evaluate(() => { const s = document.querySelector('#dv-seek'); s.value = 500; s.dispatchEvent(new Event('input')); });
    await p.waitForTimeout(150);
    const seekOk = await p.evaluate(() => { const v = document.querySelector('#demo-video'); return Math.abs(v.currentTime - v.duration / 2) < 0.6; });
    st.paused = paused; st.seek = seekOk;
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    const after = await p.evaluate(() => ({ closed: document.querySelector('#demo-overlay').classList.contains('hidden'), tut: !!document.querySelector('.view.active .overlay.tutorial-box, .view.active .overlay:not(.hidden) .tutorial-box') }));
    const ok = st.open && st.t > 0.5 && st.dur > 12 && !st.err && st.focus === 'dv-play' && !st.native && st.paused && st.seek && after.closed && after.tut;
    if (!ok) bad++;
    console.log(v, ok ? 'ok' : 'FAIL', JSON.stringify(st), JSON.stringify(after));
  }
  console.log('errors', JSON.stringify(errs));
  console.log(bad || errs.length ? 'DEMOS FAIL' : 'DEMOS OK');
  await b.close();
})();
