"""
AutoSmart AI - Unified Python Launcher
Allows running both Frontend and Backend together via Python or within a Python venv.
"""
import os
import sys
import subprocess
import signal
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def check_node_installed():
    try:
        res = subprocess.run(["node", "-v"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        if res.returncode != 0:
            print("❌ Node.js is not found. Please install Node.js (v18+) from https://nodejs.org/")
            sys.exit(1)
        print(f"✅ Node.js detected: {res.stdout.strip()}")
    except Exception as e:
        print(f"❌ Error checking Node.js: {e}")
        sys.exit(1)

def ensure_dependencies(directory, name):
    node_modules = directory / "node_modules"
    if not node_modules.exists():
        print(f"📦 Installing dependencies for {name}...")
        res = subprocess.run(["npm", "install"], cwd=directory, shell=True)
        if res.returncode != 0:
            print(f"❌ Failed to install dependencies for {name}.")
            sys.exit(1)
    else:
        print(f"✅ Dependencies ready for {name}")

def main():
    print("=" * 60)
    print("🚗 AutoSmart AI - Application Launcher")
    print("=" * 60)

    # Check if running inside a virtual environment (optional inform)
    in_venv = sys.prefix != sys.base_prefix
    if in_venv:
        print(f"🐍 Running inside Python venv: {sys.prefix}")
    else:
        print("ℹ️ Running in global Python environment")

    check_node_installed()
    ensure_dependencies(BACKEND_DIR, "Backend")
    ensure_dependencies(FRONTEND_DIR, "Frontend")

    print("\n🚀 Starting Backend (port 5000) and Frontend (port 3000)...")
    print("👉 Press Ctrl+C at any time to stop both servers.\n")

    # Start backend
    backend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=BACKEND_DIR,
        shell=True
    )

    # Start frontend
    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=FRONTEND_DIR,
        shell=True
    )

    def shutdown(signum=None, frame=None):
        print("\n🛑 Shutting down servers...")
        try:
            if sys.platform == "win32":
                subprocess.call(['taskkill', '/F', '/T', '/PID', str(backend_proc.pid)], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
                subprocess.call(['taskkill', '/F', '/T', '/PID', str(frontend_proc.pid)], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
            else:
                backend_proc.terminate()
                frontend_proc.terminate()
        except Exception:
            pass
        print("👋 All services stopped.")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("⚠️ Backend server exited unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("⚠️ Frontend server exited unexpectedly.")
                break
    except KeyboardInterrupt:
        pass
    finally:
        shutdown()

if __name__ == "__main__":
    main()
