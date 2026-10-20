import { env } from 'cloudflare:workers';

const db = () => env.DB as D1Database;

export const all = async <T = Record<string, any>>(sql: string, ...p: unknown[]) =>
  (await db().prepare(sql).bind(...p).all<T>()).results;

export const one = async <T = Record<string, any>>(sql: string, ...p: unknown[]) =>
  db().prepare(sql).bind(...p).first<T>();

export const run = (sql: string, ...p: unknown[]) => db().prepare(sql).bind(...p).run();

export const media = () => env.MEDIA as R2Bucket;
export const secrets = () => env as unknown as Record<string, string | undefined>;
