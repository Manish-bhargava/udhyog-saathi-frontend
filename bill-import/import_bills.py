import json
import requests
from datetime import datetime

API_URL = "http://localhost:7777/api/v1/bill/create/pakka"

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlZXBhbGdveWFsMTAyMDMwQGdtYWlsLmNvbSIsImlkIjoiNjljY2NjMjYxYTllMjMxMmYwNzVlMjlmIiwiaWF0IjoxNzgwOTg2OTUxLCJleHAiOjE3ODEwNzMzNTF9.GDYY_5HdXqSjE348gYGV1iaqLOt5J7UJ0vkBOauax5c"

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

with open("bills.json", "r", encoding="utf-8") as f:
    bills = json.load(f)

success_count = 0
failed_count = 0

for idx, bill in enumerate(bills, start=1):
    try:
        response = requests.post(
            API_URL,
            headers=HEADERS,
            json=bill,
            timeout=30
        )

        if response.status_code in [200, 201]:
            data = response.json()

            invoice_no = (
                data.get("data", {})
                    .get("invoiceNumber", "Unknown")
            )

            print(
                f"✅ Bill {idx} created "
                f"(Invoice #{invoice_no})"
            )

            success_count += 1

        else:
            print(
                f"❌ Bill {idx} failed "
                f"({response.status_code})"
            )
            print(response.text)

            failed_count += 1

    except Exception as e:
        print(f"❌ Bill {idx} exception: {e}")
        failed_count += 1

print("\n------------------")
print(f"Success: {success_count}")
print(f"Failed : {failed_count}")
print("------------------")