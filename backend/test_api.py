import requests

url = "http://127.0.0.1:8000/api/analyze"

match_report = "Brazil vs Argentina, World Cup Final. Brazil started in a 4-3-3 formation while Argentina played 4-4-2. Brazil dominated the first half with high pressing and quick transitions. Argentina made a tactical shift at 60 minutes, pushing their wingers higher to create a 4-2-4 in attack after falling behind 1-0. Argentina equalized at 75 minutes through a set piece. Brazil scored the winner at 88 minutes after a defensive error. Final score 2-1 to Brazil."

response = requests.post(url, json={"match_report": match_report})

import json
print(json.dumps(response.json(), indent=2))