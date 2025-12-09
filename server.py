#!/usr/bin/env python3
"""
Simple server for Vibe Computing website (local development)
- Serves static files
- Handles beta signup form submissions to Airtable
"""

import http.server
import socketserver
import json
import os
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError

PORT = 3000

# Airtable configuration - set AIRTABLE_API_KEY environment variable
AIRTABLE_API_KEY = os.environ.get('AIRTABLE_API_KEY')
AIRTABLE_BASE_ID = 'app1lloN9OOQTi7cJ'
AIRTABLE_TABLE_ID = 'tbl31rbJHeIOgDwYM'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/signup':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode('utf-8'))
                email = data.get('email', '').strip()

                if not email or '@' not in email:
                    self.send_error_response(400, 'Invalid email address')
                    return

                # Create record in Airtable
                airtable_url = f'https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_ID}'
                airtable_data = {
                    'records': [
                        {
                            'fields': {
                                'Name': email,
                            }
                        }
                    ]
                }

                req = Request(airtable_url, method='POST')
                req.add_header('Authorization', f'Bearer {AIRTABLE_API_KEY}')
                req.add_header('Content-Type', 'application/json')
                req.data = json.dumps(airtable_data).encode('utf-8')

                if not AIRTABLE_API_KEY:
                    self.send_error_response(500, 'AIRTABLE_API_KEY not configured')
                    return

                try:
                    response = urlopen(req)
                    if response.status == 200:
                        self.send_success_response()
                        print(f'[SIGNUP] New beta signup: {email}')
                    else:
                        self.send_error_response(500, 'Failed to save to Airtable')
                except HTTPError as e:
                    error_body = e.read().decode('utf-8')
                    print(f'[ERROR] Airtable error: {error_body}')
                    self.send_error_response(500, 'Failed to save signup')

            except json.JSONDecodeError:
                self.send_error_response(400, 'Invalid JSON')
            except Exception as e:
                print(f'[ERROR] {str(e)}')
                self.send_error_response(500, str(e))
        else:
            self.send_error_response(404, 'Not found')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def send_success_response(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = json.dumps({'success': True, 'message': 'Successfully signed up!'})
        self.wfile.write(response.encode('utf-8'))

    def send_error_response(self, code, message):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = json.dumps({'success': False, 'error': message})
        self.wfile.write(response.encode('utf-8'))

    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]}")

def main():
    with socketserver.TCPServer(('', PORT), CustomHandler) as httpd:
        print(f'''
╔══════════════════════════════════════════════════════╗
║         Vibe Computing Website Server                ║
╠══════════════════════════════════════════════════════╣
║  Local:   http://localhost:{PORT}                      ║
║  Network: http://0.0.0.0:{PORT}                        ║
║                                                      ║
║  Signups saved to: Airtable                          ║
╚══════════════════════════════════════════════════════╝
        ''')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n[SERVER] Shutting down...')

if __name__ == '__main__':
    main()
