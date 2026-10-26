#!/usr/bin/env bash
# Fills a LOCAL copy of the site with rich sample data, for screenshots.
#   npm run db:local        # tables and the five sample listings
#   npm run dev             # in another terminal, so this script can sign in
#   bash sample-data/load.sh
# It touches only the local database and the local R2 bucket (.wrangler/state).
set -euo pipefail
cd "$(dirname "$0")/.."
SITE=${SITE:-http://127.0.0.1:4321}
ADMIN_EMAIL=$(grep '^ADMIN_EMAIL=' .dev.vars | cut -d= -f2-)
ADMIN_PASSWORD=$(grep '^ADMIN_PASSWORD=' .dev.vars | cut -d= -f2-)
JAR=$(mktemp)

echo "1/4 adding the sample photos and the drawn plot plan"
python3 sample-data/make_images.py sample-data/images >/dev/null
npx wrangler r2 object put "ascend-media/pub/sample-plan.webp" --file sample-data/images/plan.webp --content-type image/webp --local >/dev/null
for f in sample-data/photos/*.jpg; do
  npx wrangler r2 object put "ascend-media/pub/sample-$(basename "$f")" --file "$f" --content-type image/jpeg --local >/dev/null
done

echo "2/4 adding the sample listing details, inquiries and leads"
npx wrangler d1 execute ascend-db --local --file=sample-data/sample-data.sql >/dev/null

echo "3/4 signing in as the admin"
curl -s -c "$JAR" -o /dev/null -H "Origin: $SITE" \
  --data-urlencode "email=$ADMIN_EMAIL" --data-urlencode "password=$ADMIN_PASSWORD" "$SITE/api/login"
post() { curl -s -b "$JAR" -o /dev/null -H "Origin: $SITE" "$@" "$SITE/admin/api/aftersales"; }

echo "4/4 adding a customer with a purchase, payments and a document"
post -F op=create_customer -F "name=Nimali Perera" -F phone=0771234567 -F email=nimali@example.com -F password=sample-customer-1
UID_=$(npx wrangler d1 execute ascend-db --local --json --command "SELECT id FROM users WHERE email='nimali@example.com'" | python3 -c "import json,sys;print(json.load(sys.stdin)[0]['results'][0]['id'])")
LID=$(npx wrangler d1 execute ascend-db --local --json --command "SELECT id FROM listings WHERE slug='green-valley-galle'" | python3 -c "import json,sys;print(json.load(sys.stdin)[0]['results'][0]['id'])")
post -F op=add_purchase -F "user_id=$UID_" -F "listing_id=$LID" -F "lot=Plot 4" -F total=8250000
PID=$(npx wrangler d1 execute ascend-db --local --json --command "SELECT id FROM purchases WHERE user_id=$UID_" | python3 -c "import json,sys;print(json.load(sys.stdin)[0]['results'][0]['id'])")
printf 'Sample receipt\n' > /tmp/ascend-sample-receipt.pdf
post -F op=add_payment -F "purchase_id=$PID" -F paid_on=2026-07-02 -F "description=Down payment (20%)" -F amount=1650000 -F "file=@/tmp/ascend-sample-receipt.pdf;type=application/pdf"
post -F op=add_payment -F "purchase_id=$PID" -F paid_on=2026-08-02 -F "description=Instalment 1 of 24" -F amount=275000
post -F op=add_payment -F "purchase_id=$PID" -F paid_on=2026-09-02 -F "description=Instalment 2 of 24" -F amount=275000
post -F op=add_document -F "purchase_id=$PID" -F "name=Sale agreement" -F "file=@/tmp/ascend-sample-receipt.pdf;type=application/pdf"
post -F op=update_purchase -F "purchase_id=$PID" -F stage=2 -F next_due_on=2026-11-02
rm -f "$JAR" /tmp/ascend-sample-receipt.pdf
echo "Done. Sign in at $SITE/portal as nimali@example.com / sample-customer-1, or at $SITE/login as the admin."
