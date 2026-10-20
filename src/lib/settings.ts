import { all } from './db';

// Editable in /admin/settings. Defaults apply until staff save their own values.
export const DEFAULTS = {
  wa_number: '94761500000',
  phone_display: '+94 76 150 0000',
  advisor_name: 'Adnan Azmi',
  advisor_title: 'Sales advisor',
  advisor_hours: 'Mon–Sat, 9am–6pm',
  advisor_photo: '',
  address: '',
  facebook: '',
  instagram: '',
  youtube: '',
  tiktok: '',
};
export type Settings = typeof DEFAULTS;

export async function getSettings(): Promise<Settings> {
  const s: Settings = { ...DEFAULTS };
  for (const r of await all<{ key: string; value: string }>('SELECT key, value FROM settings')) {
    if (r.key in s && r.value) (s as Record<string, string>)[r.key] = r.value;
  }
  return s;
}

export const advisorPhoto = (s: Settings) => (s.advisor_photo ? `/media/${s.advisor_photo}` : '/advisor.png');
export const firstName = (s: Settings) => s.advisor_name.split(' ')[0];

/** Click-to-chat link with a prefilled message. */
export const waLink = (s: Settings, text: string) =>
  `https://wa.me/${s.wa_number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
export const telLink = (s: Settings) => `tel:+${s.wa_number.replace(/\D/g, '')}`;
