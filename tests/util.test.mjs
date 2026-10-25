// Run: npm test   (URL allowlists, phone/price helpers, plots)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapLink, mapEmbed, lkPhone, inWords, video, lots, places, lines, arr, perches } from '../src/lib/pure.ts';

test('maps allowlist', () => {
  assert.ok(mapLink('https://maps.app.goo.gl/abc'));
  assert.ok(mapLink('https://www.google.com/maps/place/Galle'));
  assert.equal(mapLink('https://google.evil.com/maps'), '');
  assert.equal(mapLink('https://evil.com/?https://google.com/maps'), '');
  assert.equal(mapLink('http://www.google.com/maps'), '');
  assert.equal(mapLink('javascript:alert(1)'), '');
  assert.ok(mapEmbed('https://www.google.com/maps/embed?pb=1'));
  assert.equal(mapEmbed('https://www.google.com/maps/place/x'), '');
});
test('sri lankan phones', () => {
  for (const n of ['0771234567', '+94 77 123 4567', '94771234567', '077 123 4567', '0112345678']) assert.ok(lkPhone(n), n);
  for (const n of ['abc', '12345', '+1 415 555 0100']) assert.equal(lkPhone(n), '', n);
});
test('prices in words', () => {
  assert.equal(inWords(550000), '5.5 lakhs');
  assert.equal(inWords(25000000), '25 million');
  assert.equal(inWords(50000), '');
});
test('video links', () => {
  assert.equal(video('https://youtu.be/dQw4w9WgXcQ')?.kind, 'youtube');
  assert.equal(video('https://www.youtube.com/watch?v=dQw4w9WgXcQ')?.embed.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'), true);
  assert.equal(video('https://www.youtube.com/shorts/dQw4w9WgXcQ')?.kind, 'youtube');
  assert.equal(video('https://www.tiktok.com/@a/video/7123456789012345678')?.kind, 'tiktok');
  assert.equal(video('https://fb.watch/abc123/')?.kind, 'facebook');
  assert.equal(video('https://youtube.evil.com/watch?v=dQw4w9WgXcQ'), null);
  assert.equal(video('http://youtu.be/dQw4w9WgXcQ'), null);
  assert.equal(video('javascript:alert(1)'), null);
});
test('plots, places, lines', () => {
  assert.equal(lots('[{"l":"Plot 1","p":10,"price":5e6,"s":"sold"},{"l":"","p":1}]').length, 1);
  assert.equal(lots('[{"l":"A","s":"weird"}]')[0].s, 'available');
  assert.equal(lots('not json').length, 0);
  assert.deepEqual(places('["Galle town – 12 min","School: 1 km"]'), [['Galle town', '12 min'], ['School', '1 km']]);
  assert.deepEqual(lines('✅ Near beach\n- Quiet lane\n\n', 6), ['Near beach', 'Quiet lane']);
  assert.deepEqual(arr('bad'), []);
});

test('seller extent gets "perches" only when it is a bare number', () => {
  assert.equal(perches('20'), '20 perches');
  assert.equal(perches('20 perches'), '20 perches');
  assert.equal(perches('1 acre'), '1 acre');
  assert.equal(perches(''), '');
  assert.equal(perches(null), '');
});
