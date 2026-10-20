import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseChat, findListings } from '../src/lib/chat.ts';

const ANDROID = `1/2/24, 9:41 AM - Messages and calls are end-to-end encrypted.
31/12/2023, 21:41 - Ascend: IMG-20231231-WA0001.jpg (file attached)
31/12/2023, 21:42 - Ascend: IMG-20231231-WA0002.jpg (file attached)
31/12/2023, 21:43 - Ascend: LAND FOR SALE
Green Valley Plots, Habaraduwa Galle
10 perches, Rs 5.5 lakhs per perch
Clear deed, water, electricity
31/12/2023, 21:50 - Buyer: Is it available?
31/12/2023, 23:59 - Ascend: IMG-20231231-WA0003.jpg (file attached)`;
const IOS = `[01/01/2024, 10:05:11] Ascend: ‎<attached: 00000012-PHOTO-2024-01-01-10-05-11.jpg>
[01/01/2024, 10:06:00] Ascend: Beautiful house in Kandy, 4 bedrooms. Rs. 45 million
[01/01/2024, 10:07:00] Ascend: Beautiful house in Kandy, 4 bedrooms. Rs. 45 million
[02/01/2024, 08:00:00] Ascend: Good morning everyone`;

test('android export', () => {
  const m = parseChat(ANDROID);
  assert.equal(m.length, 5);
  assert.equal(m[0].files[0], 'IMG-20231231-WA0001.jpg');
  assert.match(m[2].text, /Green Valley/); assert.match(m[2].text, /electricity/);
  const f = findListings(m);
  assert.equal(f.length, 1);
  assert.deepEqual(f[0].files, ['IMG-20231231-WA0001.jpg', 'IMG-20231231-WA0002.jpg']); // the 23:59 photo is too far away
});
test('iphone export, reposted ad counted once', () => {
  const f = findListings(parseChat(IOS));
  assert.equal(f.length, 1);
  assert.deepEqual(f[0].files, ['00000012-PHOTO-2024-01-01-10-05-11.jpg']);
});
test('us date order is detected', () => {
  const m = parseChat('12/31/23, 9:00 PM - A: hello\n1/2/24, 9:00 AM - A: hi');
  assert.ok(m[1].t > m[0].t);
});
