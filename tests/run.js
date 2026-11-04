const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const root = path.resolve(__dirname, '..');
const py = process.env.PYTHON || 'python';

function up(cb, tries = 50) {
  http.get('http://127.0.0.1:8765/', r => { r.resume(); cb(true); }).on('error', () => tries ? setTimeout(() => up(cb, tries - 1), 200) : cb(false));
}

const results = [];
const m = spawnSync(py, [path.join(root, 'model', 'test_model.py')], { cwd: root, encoding: 'utf8' });
results.push(['model/test_model.py', m.status === 0, (m.stdout + m.stderr).trim().split('\n').pop()]);

const server = spawn(py, [path.join(root, 'run.py'), '--serve', '--port', '8765'], { cwd: root, stdio: 'ignore' });
up(ok => {
  if (!ok) { console.error('server did not start'); server.kill(); process.exit(1); }
  const only = process.argv.slice(2);
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js') && (!only.length || only.some(o => f.includes(o)))).sort();
  for (const f of files) {
    const r = spawnSync(process.execPath, [path.join(__dirname, f)], { cwd: __dirname, encoding: 'utf8', timeout: 300000 });
    const last = (r.stdout + r.stderr).trim().split('\n').pop();
    results.push([f, r.status === 0 && !/FAIL/.test(last), last]);
  }
  server.kill();
  let bad = 0;
  for (const [f, ok, last] of results) { if (!ok) bad++; console.log((ok ? 'pass ' : 'FAIL ') + f + (ok ? '' : '  ' + last)); }
  console.log(bad ? bad + ' failed' : 'all passed');
  process.exit(bad ? 1 : 0);
});
