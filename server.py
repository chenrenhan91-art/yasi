#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Local Server for IELTS Speaking AI Studio
Supports static file serving + /api/tts neural voice synthesis via rany2/edge-tts (if installed).
"""
import http.server
import socketserver
import urllib.parse
import subprocess
import tempfile
import shutil
import json
import os
import sys

PORT = 8765
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)


class StudioRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/tts-status':
            has_edge_tts = shutil.which('edge-tts') is not None
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'ok': True,
                'edge_tts_installed': has_edge_tts
            }).encode('utf-8'))
            return

        if parsed.path == '/api/tts':
            query = urllib.parse.parse_qs(parsed.query)
            text = (query.get('text', [''])[0] or '').strip()
            voice = (query.get('voice', ['en-GB-RyanNeural'])[0] or 'en-GB-RyanNeural').strip()
            rate = (query.get('rate', ['1.0'])[0] or '1.0').strip()

            if not text:
                self.send_error(400, 'Missing text')
                return

            try:
                rate_float = float(rate)
                pct = int(round((rate_float - 1.0) * 100))
                rate_str = f"+{pct}%" if pct >= 0 else f"{pct}%"
            except Exception:
                rate_str = "+0%"

            edge_bin = shutil.which('edge-tts')
            if edge_bin:
                try:
                    with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as tmp:
                        tmp_path = tmp.name
                    subprocess.run(
                        [edge_bin, '--voice', voice, f'--rate={rate_str}', '--text', text, '--write-media', tmp_path],
                        check=True,
                        timeout=15
                    )
                    with open(tmp_path, 'rb') as f:
                        audio_bytes = f.read()
                    os.unlink(tmp_path)

                    self.send_response(200)
                    self.send_header('Content-Type', 'audio/mpeg')
                    self.send_header('Content-Length', str(len(audio_bytes)))
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(audio_bytes)
                    return
                except Exception as e:
                    print(f"[edge-tts fallback] {e}", file=sys.stderr)

            self.send_response(501)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'edge-tts not installed, fallback to browser neural prosody engine'}).encode('utf-8'))
            return

        return super().do_GET()


if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), StudioRequestHandler) as httpd:
        print(f"🎙️ IELTS Speaking AI Studio Server running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
