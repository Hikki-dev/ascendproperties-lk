import type { APIRoute } from 'astro';
import { all } from '../../../lib/db';

// CSV download of leads for Excel / Google Sheets. Table name is whitelisted.
const Q = {
  inquiries: ['Date,Name,Phone,Email,Message,Property,Status', "SELECT i.created_at,i.name,i.phone,i.email,i.message,l.title,i.status FROM inquiries i LEFT JOIN listings l ON l.id=i.listing_id ORDER BY i.id DESC"],
  sellers: ['Date,Name,Mobile,Email,City,Extent,Expected price,Status', 'SELECT created_at,name,mobile,email,city,extent,price,status FROM seller_leads ORDER BY id DESC'],
} as const;

// Cells starting with = + - @ would run as formulas in Excel; prefix them with a quote.
const cell = (v: unknown) => { let t = String(v ?? '').replace(/\s+/g, ' '); if (/^[=+\-@]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };

export const GET: APIRoute = async ({ url }) => {
  const k = url.searchParams.get('t') as keyof typeof Q;
  if (!Q[k]) return new Response('Not found', { status: 404 });
  const rows = await all<Record<string, unknown>>(Q[k][1]);
  const body = [Q[k][0], ...rows.map((r) => Object.values(r).map(cell).join(','))].join('\r\n');
  return new Response('﻿' + body, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${k}.csv"`, 'Cache-Control': 'no-store' } });
};
