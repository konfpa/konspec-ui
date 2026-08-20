#!/usr/bin/env python3
"""Static server that declares UTF-8, so llms.txt and registry.json render correctly.

python -m http.server sends `text/plain` with no charset, and browsers then fall
back to windows-1252 — every em dash turns into 'â€"'. GitHub Pages sets the
charset itself, so this only matters locally.
"""
import http.server, socketserver, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8051


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.txt':  'text/plain; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.html': 'text/html; charset=utf-8',
        '.js':   'text/javascript; charset=utf-8',
        '.css':  'text/css; charset=utf-8',
        '.md':   'text/markdown; charset=utf-8',
    }

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


class Server(socketserver.ThreadingTCPServer):
    # threaded, or one browser tab holding a keep-alive connection blocks everything
    allow_reuse_address = True
    daemon_threads = True


with Server(('0.0.0.0', PORT), Handler) as httpd:
    print(f'serving {PORT} with charset=utf-8')
    httpd.serve_forever()
