import argparse
import functools
import http.server
import importlib.util
import json
import socket
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODEL_SOURCES = [ROOT / "model" / "nexus_model.py", ROOT / "model" / "build_data.py", ROOT / "model" / "stochastic.py", *sorted((ROOT / "model" / "inputs").glob("*.json"))]
NO_WINDOW = getattr(subprocess, "CREATE_NO_WINDOW", 0)
HEARTBEAT = "/__nexus/heartbeat"
DEFAULT_PORT = 8765


def python_cli():
    exe = Path(sys.executable)
    if exe.name.lower() == "pythonw.exe" and (exe.parent / "python.exe").exists():
        return str(exe.parent / "python.exe")
    return sys.executable


def call(args):
    r = subprocess.run([python_cli()] + args, cwd=ROOT, capture_output=True, text=True, creationflags=NO_WINDOW)
    if r.returncode:
        msg = (r.stderr or r.stdout).strip()
        raise RuntimeError(msg.splitlines()[-1] if msg else "exit code %d" % r.returncode)
    return r.stdout


def stale(target, sources):
    return not target.exists() or any(s.stat().st_mtime > target.stat().st_mtime for s in sources)


def needs_model(force=False):
    return force or stale(ROOT / "data.json", MODEL_SOURCES)


def needs_docs():
    return stale(ROOT / "docs" / "methods.js", [ROOT / "docs" / "METHODS.md"])


def ensure_requirements(log=print):
    if importlib.util.find_spec("pulp") is None or importlib.util.find_spec("highspy") is None:
        log("Installing the solver (one time)")
        call(["-m", "pip", "install", "-q", "-r", str(ROOT / "requirements.txt")])
        importlib.invalidate_caches()
        return "installed"
    return "ready"


def build_model(force=False, log=print):
    if needs_model(force):
        log("Solving the optimisation model")
        call([str(ROOT / "model" / "build_data.py")])
        return "re-solved"
    return "up to date"


def build_docs(log=print):
    if needs_docs():
        log("Refreshing the methods report")
        call([str(ROOT / "model" / "build_data.py"), "--docs-only"])
        return "refreshed"
    return "up to date"


def running_nexus(port=DEFAULT_PORT):
    try:
        with urllib.request.urlopen("http://127.0.0.1:%d%s" % (port, HEARTBEAT), timeout=1) as r:
            return r.headers.get("X-Nexus") == "1"
    except Exception:
        return False


def free_port(start=DEFAULT_PORT):
    for port in range(start, start + 50):
        with socket.socket() as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
    raise RuntimeError("no free port between %d and %d" % (start, start + 49))


class NexusServer(http.server.ThreadingHTTPServer):
    last_seen = 0.0


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def end_headers(self):
        if self.command in ("GET", "HEAD") and self.path.split("?")[0] != HEARTBEAT:
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path.split("?")[0] == HEARTBEAT:
            self.server.last_seen = time.time()
            self.send_response(204)
            self.send_header("X-Nexus", "1")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            return
        super().do_GET()

    def reply(self, code, body):
        data = json.dumps(body).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path.split("?")[0] != "/api/solve":
            return self.reply(404, {"error": "not found"})
        if "application/json" not in self.headers.get("Content-Type", ""):
            return self.reply(415, {"error": "send application/json"})
        size = int(self.headers.get("Content-Length") or 0)
        if not 0 < size <= 65536:
            return self.reply(413, {"error": "body must be 1 to 65536 bytes"})
        self.server.last_seen = time.time()
        if str(ROOT / "model") not in sys.path:
            sys.path.insert(0, str(ROOT / "model"))
        import lab
        try:
            body = json.loads(self.rfile.read(size).decode("utf-8"))
            ids = getattr(self.server, "supplier_ids", None)
            if ids is None:
                ids = self.server.supplier_ids = {s["id"] for s in json.loads((ROOT / "model" / "inputs" / "suppliers.json").read_text(encoding="utf-8"))}
            scenario, weights, stochastic = lab.validate(body, ids)
        except (ValueError, UnicodeDecodeError) as e:
            return self.reply(400, {"error": str(e)})
        try:
            result = lab.solve_scenario(scenario, weights, stochastic=stochastic)
        except Exception as e:
            return self.reply(500, {"error": "solver failed: %s" % e})
        self.server.last_seen = time.time()
        self.reply(200, result)


def start_server(port, idle_seconds=None):
    server = NexusServer(("127.0.0.1", port), functools.partial(Handler, directory=str(ROOT)))
    server.last_seen = time.time()
    threading.Thread(target=server.serve_forever, daemon=True).start()
    if idle_seconds:
        def watch():
            while time.time() - server.last_seen < idle_seconds:
                time.sleep(1)
            server.shutdown()
            server.server_close()
        threading.Thread(target=watch, daemon=True).start()
    return server, "http://127.0.0.1:%d/" % port


def make_shortcut(desktop=False):
    exe = Path(sys.executable)
    pyw = exe.parent / "pythonw.exe"
    target = str(pyw if pyw.exists() else exe)
    places = [ROOT]
    if desktop:
        places.append(Path.home() / "Desktop")
    made = []
    for place in places:
        lnk = place / "Cairn.lnk"
        ps = ("$s=(New-Object -ComObject WScript.Shell).CreateShortcut('%s');$s.TargetPath='%s';"
              "$s.Arguments='\"%s\"';$s.WorkingDirectory='%s';$s.IconLocation='%s,0';"
              "$s.Description='Build and open Cairn';$s.Save()") % (
            lnk, target, ROOT / "launcher" / "launch.py", ROOT, ROOT / "assets" / "nexus.ico")
        subprocess.run(["powershell", "-NoProfile", "-Command", ps], check=True, creationflags=NO_WINDOW)
        made.append(str(lnk))
    return made


def main():
    ap = argparse.ArgumentParser(description="Build and open Cairn")
    ap.add_argument("--rebuild", action="store_true", help="re-solve the model even if nothing changed")
    ap.add_argument("--no-browser", action="store_true", help="start the server without opening a browser")
    ap.add_argument("--serve", action="store_true", help="serve only: no build, no browser (used by the tests)")
    ap.add_argument("--port", type=int, default=DEFAULT_PORT)
    ap.add_argument("--check", action="store_true", help="build, serve, verify the main files load, then exit")
    ap.add_argument("--shortcut", action="store_true", help="create the Cairn shortcut in this folder (Windows)")
    ap.add_argument("--desktop", action="store_true", help="with --shortcut, also put one on the desktop")
    args = ap.parse_args()

    if args.shortcut:
        for path in make_shortcut(args.desktop):
            print("created", path)
        return

    if args.serve:
        server, url = start_server(args.port)
        print("serving", url, flush=True)
        try:
            threading.Event().wait()
        except KeyboardInterrupt:
            server.shutdown()
        return

    if needs_model(args.rebuild):
        ensure_requirements()
    print("Model:", build_model(args.rebuild))
    print("Methods report:", build_docs())
    server, url = start_server(free_port(args.port))

    if args.check:
        for path in ("", "data.js", "docs/methods.js", "greenchainml/index.html"):
            with urllib.request.urlopen(url + path, timeout=10) as r:
                assert r.status == 200, path
        assert running_nexus(int(url.rsplit(":", 1)[1].strip("/")))
        server.shutdown()
        print("CHECK OK", url)
        return

    print("\nCairn is running at %s" % url)
    print("Press Ctrl+C to stop.\n")
    if not args.no_browser:
        webbrowser.open(url)
    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        pass
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
