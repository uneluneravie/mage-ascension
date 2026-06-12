from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json


ROOT = Path(__file__).resolve().parents[1]
LOG_PATH = ROOT / "testes" / "test-results.json"


class TestHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/test-results":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)

        try:
            data = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
            return

        LOG_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        self.send_response(204)
        self.end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8765), TestHandler)
    print("Serving tests at http://127.0.0.1:8765/testes/index.html")
    print(f"Writing logs to {LOG_PATH}")
    server.serve_forever()
