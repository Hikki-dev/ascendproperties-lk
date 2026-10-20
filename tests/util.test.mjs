// Run: node --test tests/   (checks the URL allowlist and phone/price helpers)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// util.ts imports the Cloudflare runtime, so evaluate only the pure helpers.
const src = readFileSync(new URL('../src/lib/util.ts', import.meta.url), 'utf8');
const pure = src.slice(src.indexOf('/** "5.5 lakhs"')).replace(/export const/g, 'const').replace(/\(u\?: string \| null\)/g, '(u)').replace(/\(raw: string\)/g, '(raw)').replace(/\(n: number\)/g, '(n)').replace(/\(x: number\)/g, '(x)').replace(/: \(.*?\) =>/g, ' =>');
const { mapLink, mapEmbed, lkPhone, inWords } = new Function(pure.replace(/const mapParts = \(u\?: string \| null\)/, 'const mapParts = (u)') + '; return { mapLink, mapEmbed, lkPhone, inWords };')();

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
