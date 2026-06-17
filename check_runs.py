import urllib.request
import json

url = "https://api.github.com/repos/eltranza83/adepec_home_builder/actions/runs"
headers = {"User-Agent": "Mozilla/5.0"}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        for run in data.get("workflow_runs", [])[:4]:
            print(f"Commit: {run.get('head_commit', {}).get('message')}")
            print(f"Status: {run.get('status')}")
            print(f"Conclusion: {run.get('conclusion')}")
            print("-" * 30)
except Exception as e:
    print(f"Error: {e}")
