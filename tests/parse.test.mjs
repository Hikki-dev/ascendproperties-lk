import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseListing, findPrice } from '../src/lib/parse.ts';

const D = ['Colombo', 'Galle', 'Kandy'];
test('prices', () => {
  assert.equal(findPrice('Rs. 5.5 lakhs per perch').price, 550000);
  assert.equal(findPrice('Price: LKR 1,250,000 per perch').price, 1250000);
  assert.equal(findPrice('Only 12M total').price, 12000000);
  assert.equal(findPrice('Call 0771234567 for details').price, 0);
  assert.equal(findPrice('15 perches, 3 min to town').price, 0);
});
test('whatsapp style land post', () => {
  const p = parseListing(`🔥 *LAND FOR SALE* 🔥\nGreen Valley Plots, Habaraduwa Galle\n10 - 25 perches\nRs 5.5 lakhs per perch\n✅ Clear deed\n✅ Electricity and water\n✅ Tarred road\nCall 077 123 4567`, D);
  assert.equal(p.type, 'land'); assert.equal(p.district, 'Galle'); assert.equal(p.price, 550000); assert.equal(p.price_label, 'per perch');
  assert.equal(p.extent, '10 to 25 perches');
  for (const f of ['Clear title', 'Electricity', 'Water', 'Tarred road']) assert.ok(p.facilities.includes(f), f);
  assert.match(p.title, /Green Valley/);
});
test('house post', () => {
  const p = parseListing('Beautiful house in Kandy, 4 bedrooms. Rs. 45 million', D);
  assert.equal(p.type, 'house'); assert.equal(p.price, 45000000); assert.equal(p.district, 'Kandy');
});
