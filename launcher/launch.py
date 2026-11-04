import ctypes
import queue
import sys
import threading
import time
import tkinter as tk
import tkinter.font as tkfont
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import run

IDLE_SECONDS = 180
DARK = {"bg": "#0d1413", "surface": "#141d1c", "line": "#233230", "line_strong": "#3a4a46", "text": "#eceee6",
        "text2": "#adbab3", "muted": "#82938b", "accent": "#f2a93b", "ok": "#5cc98e", "err": "#f06f5f"}
LIGHT = {"bg": "#f2f1ea", "surface": "#e7e8df", "line": "#d6d9cd", "line_strong": "#aeb5a6", "text": "#14201d",
         "text2": "#3c4a45", "muted": "#5a6862", "accent": "#9a5800", "ok": "#1f7547", "err": "#b53628"}
STEPS = [("req", "Python requirements"), ("model", "Optimisation model"), ("docs", "Methods report"), ("server", "Local server")]


def windows_light():
    try:
        import winreg
        k = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize")
        return winreg.QueryValueEx(k, "AppsUseLightTheme")[0] == 1
    except Exception:
        return False


def serve_and_open():
    port = run.free_port()
    server, url = run.start_server(port, IDLE_SECONDS)
    webbrowser.open(url)
    return server, url


class Splash:
    def __init__(self):
        try:
            ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID("ProjectNexus.Launcher")
            ctypes.windll.shcore.SetProcessDpiAwareness(1)
            ctypes.windll.gdi32.AddFontResourceExW(str(ROOT / "assets" / "fonts" / "Manrope.ttf"), 0x10, 0)
        except Exception:
            pass
        self.c = LIGHT if windows_light() else DARK
        self.root = tk.Tk()
        self.root.title("Cairn")
        self.root.configure(bg=self.c["bg"])
        self.root.resizable(False, False)
        try:
            self.root.iconbitmap(str(ROOT / "assets" / "nexus.ico"))
        except Exception:
            pass
        fams = set(tkfont.families())
        f = lambda name: name if name in fams else "Segoe UI"
        self.f_title, self.f_body = (f("Manrope ExtraBold"), 18), (f("Manrope"), 10)
        self.f_med, self.f_small, self.f_btn = (f("Manrope SemiBold"), 10), (f("Manrope"), 9), (f("Manrope SemiBold"), 10)
        self.q = queue.Queue()
        self.state = {}
        self.server = None
        self.pulse = 0
        self.build()
        self.dark_titlebar()
        self.root.protocol("WM_DELETE_WINDOW", self.close)
        self.root.bind("<Escape>", lambda e: self.close())
        self.root.after(80, self.poll)
        self.root.after(90, self.animate)
        self.root.after(150, self.start)

    def dark_titlebar(self):
        if self.c is LIGHT:
            return
        try:
            self.root.update_idletasks()
            hwnd = ctypes.windll.user32.GetParent(self.root.winfo_id())
            v = ctypes.c_int(1)
            ctypes.windll.dwmapi.DwmSetWindowAttribute(hwnd, 20, ctypes.byref(v), ctypes.sizeof(v))
        except Exception:
            pass

    def label(self, parent, text, font, fg, **kw):
        return tk.Label(parent, text=text, font=font, fg=fg, bg=self.c["bg"], **kw)

    def hairline(self, parent):
        tk.Frame(parent, height=1, bg=self.c["line"]).pack(fill="x")

    def button(self, parent, text, cmd, primary=False):
        c = self.c
        bg, fg, hov = (c["text"], c["bg"], c["text2"]) if primary else (c["bg"], c["text"], c["surface"])
        rest = c["bg"] if primary else c["line_strong"]
        holder = tk.Frame(parent, bg=rest)
        b = tk.Label(holder, text=text, font=self.f_btn, bg=bg, fg=fg, padx=16, pady=8, cursor="hand2", takefocus=1)

        def fire(e=None):
            cmd()
            return "break"
        for ev in ("<Button-1>", "<Return>", "<space>"):
            b.bind(ev, fire)
        b.bind("<Enter>", lambda e: b.configure(bg=hov))
        b.bind("<Leave>", lambda e: b.configure(bg=bg))
        b.bind("<FocusIn>", lambda e: holder.configure(bg=c["accent"]))
        b.bind("<FocusOut>", lambda e: holder.configure(bg=rest))
        b.pack(padx=1, pady=1)
        return holder

    def build(self):
        c = self.c
        pad = tk.Frame(self.root, bg=c["bg"], padx=26, pady=22)
        pad.pack(fill="both", expand=True)
        head = tk.Frame(pad, bg=c["bg"])
        head.pack(fill="x")
        try:
            self.logo = tk.PhotoImage(file=str(ROOT / "assets" / "nexus.png")).subsample(8)
            tk.Label(head, image=self.logo, bg=c["bg"], bd=0).pack(side="left", padx=(0, 10))
        except Exception:
            pass
        self.label(head, "Cairn", self.f_title, c["text"]).pack(side="left")
        self.status = self.label(pad, "Getting ready", self.f_body, c["text2"], anchor="w", justify="left", wraplength=400)
        self.status.pack(fill="x", pady=(4, 14))
        self.hairline(pad)
        self.rows = {}
        for key, name in STEPS:
            r = tk.Frame(pad, bg=c["bg"], pady=8)
            r.pack(fill="x")
            dot = tk.Canvas(r, width=12, height=12, bg=c["bg"], highlightthickness=0)
            dot.pack(side="left", padx=(0, 12))
            oval = dot.create_oval(2, 2, 10, 10, fill=c["line_strong"], outline="")
            self.label(r, name, self.f_med, c["text"]).pack(side="left")
            det = self.label(r, "Waiting", self.f_small, c["muted"])
            det.pack(side="right")
            self.hairline(pad)
            self.rows[key] = (dot, oval, det)
            self.state[key] = "wait"
        self.bar = tk.Frame(pad, bg=c["bg"])
        self.bar.pack(fill="x", pady=(16, 0))
        self.root.update_idletasks()
        self.root.minsize(430, 0)
        w, h = max(430, self.root.winfo_reqwidth()), self.root.winfo_reqheight()
        self.root.geometry("+%d+%d" % ((self.root.winfo_screenwidth() - w) // 2, (self.root.winfo_screenheight() - h) // 3))

    def step(self, key, state, detail):
        self.q.put(("step", key, state, detail))

    def worker(self):
        try:
            self.step("req", "run", "Checking")
            self.step("req", "ok", "PuLP " + run.ensure_requirements(lambda m: self.q.put(("status", m))))
            self.step("model", "run", "Checking")
            self.step("model", "ok", run.build_model(False, lambda m: self.q.put(("status", m + ". This takes a few seconds."))).capitalize())
            self.step("docs", "run", "Checking")
            self.step("docs", "ok", run.build_docs(lambda m: self.q.put(("status", m))).capitalize())
            self.step("server", "run", "Starting")
            self.server, url = serve_and_open()
            self.step("server", "ok", url.replace("http://", "").rstrip("/"))
            self.q.put(("ready", url))
        except Exception as e:
            for key, _ in STEPS:
                if self.state.get(key) == "run":
                    self.step(key, "fail", "Failed")
            self.q.put(("error", str(e)))

    def start(self):
        for w in self.bar.winfo_children():
            w.destroy()
        for key, _ in STEPS:
            self.apply(key, "wait", "Waiting")
        self.status.configure(text="Getting ready", fg=self.c["text2"])
        threading.Thread(target=self.worker, daemon=True).start()

    def apply(self, key, state, detail):
        dot, oval, det = self.rows[key]
        self.state[key] = state
        dot.itemconfigure(oval, fill={"wait": self.c["line_strong"], "run": self.c["accent"], "ok": self.c["ok"], "fail": self.c["err"]}[state])
        det.configure(text=detail, fg=self.c["err"] if state == "fail" else self.c["muted"] if state == "wait" else self.c["text2"])

    def poll(self):
        try:
            while True:
                m = self.q.get_nowait()
                if m[0] == "step":
                    self.apply(*m[1:])
                elif m[0] == "status":
                    self.status.configure(text=m[1])
                elif m[0] == "ready":
                    self.status.configure(text="Opening in your browser.")
                    self.root.after(900, self.root.destroy)
                elif m[0] == "error":
                    self.status.configure(text="Something went wrong: " + m[1], fg=self.c["err"])
                    self.button(self.bar, "Try again", self.start, primary=True).pack(side="left")
                    self.button(self.bar, "Close", self.close).pack(side="right")
        except queue.Empty:
            pass
        if self.root.winfo_exists():
            self.root.after(80, self.poll)

    def animate(self):
        self.pulse = (self.pulse + 1) % 12
        for key, (dot, oval, _) in self.rows.items():
            if self.state.get(key) == "run":
                r = 1 + (self.pulse % 6) * 0.35 if self.pulse < 6 else 3.1 - (self.pulse % 6) * 0.35
                dot.coords(oval, 4 - r, 4 - r, 8 + r, 8 + r)
            else:
                dot.coords(oval, 2, 2, 10, 10)
        self.root.after(90, self.animate)

    def close(self):
        if self.server is not None:
            self.server.shutdown()
            self.server = None
        self.root.destroy()


def keep_alive(server):
    while time.time() - server.last_seen < IDLE_SECONDS + 10:
        time.sleep(5)


def main():
    if run.running_nexus():
        webbrowser.open("http://127.0.0.1:%d/" % run.DEFAULT_PORT)
        return
    if not run.needs_model() and not run.needs_docs():
        server, _ = serve_and_open()
        keep_alive(server)
        return
    splash = Splash()
    splash.root.mainloop()
    if splash.server is not None:
        keep_alive(splash.server)


if __name__ == "__main__":
    main()
