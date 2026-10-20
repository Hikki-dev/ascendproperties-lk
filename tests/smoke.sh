#!/bin/bash
# End-to-end smoke test against a running dev server (npm run dev) with a freshly seeded local DB.
B=${BASE:-http://localhost:4321}; J=$(mktemp); C=$(mktemp)
post(){ curl -s -o /dev/null -w "%{http_code} %{redirect_url}" -H "Origin: $B" "$@"; echo; }
ok(){ [[ "$2" == *"$3"* ]] && echo "PASS $1" || { echo "FAIL $1: got '$2' want '$3'"; FAIL=1; }; }

ok "bad login rejected" "$(post -c $J -F email=admin@ascend.local -F password=wrong $B/api/login)" "login?err=1"
ok "admin login" "$(post -c $J -F email=admin@ascend.local -F password=ascend-dev-pass-123 $B/api/login)" "/admin"
ok "admin dashboard" "$(curl -s -o /dev/null -w '%{http_code}' -b $J $B/admin)" "200"
ok "cross-origin POST blocked" "$(curl -s -o /dev/null -w '%{http_code}' -H 'Origin: http://evil.example' -F name=x -F phone=0771234567 $B/api/inquiry)" "403"
ok "inquiry saved" "$(post -F name=Test -F phone=0771234567 -F listing_id=1 -F back=/listing/sample-land-one $B/api/inquiry)" "sent=1"
ok "bad phone rejected" "$(post -F name=Test -F phone=abc -F back=/contact $B/api/inquiry)" "err=1"
ok "create listing" "$(post -b $J -F title='Smoke Test Land' -F type=land -F district=Galle -F price=123000 -F status=available -F photos='[]' $B/admin/api/listing)" "/admin/listings/"
ok "listing is public" "$(curl -s $B/lands?q=Smoke | grep -c 'Smoke Test Land')" "1"
ok "draft hidden" "$(post -b $J -F title='Hidden Draft' -F type=land -F district=Galle -F price=1 -F status=draft -F photos='[]' $B/admin/api/listing >/dev/null; curl -s $B/lands?q=Hidden | grep -c 'Hidden Draft')" "0"
ok "banner create" "$(post -b $J -F op=create -F slot=home_banner -F title='Smoke Ad' -F cta_url='javascript:alert(1)' $B/admin/api/banner)" "/admin/banners"
ok "js: url neutralised" "$(curl -s $B/ | grep -c 'javascript:alert')" "0"
R=$(post -b $J -F op=create_customer -F name=Cust -F email=cust$RANDOM@example.com -F password=customerpass1 $B/admin/api/aftersales)
ok "create customer" "$R" "/admin/customers/"
CID=${R##*/}; EMAIL=$(curl -s -b $J $B/admin/customers/$CID | grep -o 'cust[0-9]*@example.com' | head -1)
ok "add purchase" "$(post -b $J -F op=add_purchase -F user_id=$CID -F total=1000000 -F lot=A1 $B/admin/api/aftersales)" "/admin/customers/$CID"
PID=$(curl -s -b $J $B/admin/customers/$CID | grep -o 'name="purchase_id" value="[0-9]*"' | head -1 | grep -o '[0-9]*')
ok "add payment" "$(post -b $J -F op=add_payment -F purchase_id=$PID -F amount=250000 -F description='Deposit' $B/admin/api/aftersales)" "/admin/customers/$CID"
ok "customer login" "$(post -c $C -F email=$EMAIL -F password=customerpass1 $B/api/login)" "/portal"
ok "portal shows payment" "$(curl -s -b $C $B/portal | grep -c '250,000')" "1"
ok "customer blocked from admin" "$(curl -s -o /dev/null -w '%{redirect_url}' -b $C $B/admin)" "/login"
ok "customer ticket" "$(post -b $C -F subject=Help -F body='Where is my deed?' -F purchase_id=$PID $B/api/ticket)" "/portal/tickets/"
ok "private media denied anon" "$(curl -s -o /dev/null -w '%{http_code}' $B/media/priv/x.pdf)" "403"
ok "admin hidden from anon api" "$(curl -s -o /dev/null -w '%{http_code}' -H "Origin: $B" -F file=@/dev/null $B/admin/api/upload)" "302"

# --- rich listings, video, importer, flyer
LOTS='[{"l":"Plot 1","p":10.5,"price":5775000,"s":"available"},{"l":"Plot 2","p":12,"price":6600000,"s":"sold"}]'
R=$(post -b $J -F title='Rich Test Land' -F type=land -F district=Galle -F price=550000 -F status=available -F photos='[]' -F highlights=$'Near the beach\nQuiet lane' -F places=$'Galle town – 12 min\nMain road – 200 m' -F video_url='https://www.youtube.com/watch?v=dQw4w9WgXcQ' -F lots="$LOTS" -F map_url='https://google.evil.com/maps/x' $B/admin/api/listing)
SLUG=rich-test-land
PAGE=$(curl -s $B/listing/$SLUG)
ok "highlights shown" "$(echo "$PAGE" | grep -c 'Near the beach')" "1"
ok "nearby shown" "$(echo "$PAGE" | grep -c 'Main road')" "1"
ok "plots table" "$(echo "$PAGE" | grep -c 'Plot 2')" "1"
ok "video poster" "$(echo "$PAGE" | grep -c 'youtube-nocookie.com/embed/dQw4w9WgXcQ')" "1"
ok "bad map link hidden" "$(echo "$PAGE" | grep -c 'google.evil.com')" "0"
ok "og:image present" "$(echo "$PAGE" | grep -c 'property="og:image"')" "1"
ok "flyer page" "$(curl -s -o /dev/null -w '%{http_code}' $B/listing/$SLUG/flyer)" "200"
ok "non-video url dropped" "$(post -b $J -F title='Bad Video' -F type=land -F district=Galle -F price=1 -F status=available -F photos='[]' -F video_url='https://evil.com/x' $B/admin/api/listing >/dev/null; curl -s $B/listing/bad-video | grep -c 'class="vf-btn"')" "0"
ok "import creates hidden draft" "$(post -b $J --data-urlencode "text=Sunrise Plots Matara
12 perches Rs 4 lakhs per perch
clear deed, water, electricity" $B/admin/api/import)" "imported=1"
ok "imported draft not public" "$(curl -s -o /dev/null -w '%{http_code}' $B/listing/sunrise-plots-matara)" "404"
[[ -z "$FAIL" ]] && echo "ALL PASSED" || exit 1
