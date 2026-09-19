// Tripwire: every /api/cron route must answer both GET and POST.
//
// Why this exists. The six cron routes originally exported POST only, while
// Vercel Cron invokes its scheduled paths with a GET request. Every scheduled
// run therefore answered 405 and the job never executed — confirmed against
// the deployed app, where GET /api/cron/outbox-drain returned 405 while POST
// returned 401 from the auth gate. Nothing failed loudly: the deployment was
// green, the schedules were listed in the Vercel dashboard, and no e-mail was
// ever sent.
//
// A static read rather than an import: these modules pull in prisma and the
// env validator at module scope, so importing them here would couple this
// tripwire to database and environment setup it has no business needing.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import fg from 'fast-glob';

const here = dirname(fileURLToPath(import.meta.url));
const APP_API_CRON = resolve(here, '../../../app/api/cron');

async function cronRouteFiles(): Promise<string[]> {
  return fg('*/route.ts', { cwd: APP_API_CRON, onlyFiles: true });
}

describe('cron route HTTP surface', () => {
  it('finds the cron routes', async () => {
    const files = await cronRouteFiles();
    expect(files.length).toBeGreaterThan(0);
  });

  it('every cron route exports POST', async () => {
    for (const file of await cronRouteFiles()) {
      const src = readFileSync(resolve(APP_API_CRON, file), 'utf8');
      expect(src, `${file} must export POST`).toMatch(/export async function POST\b/);
    }
  });

  it('every cron route also exports GET, which is what Vercel Cron sends', async () => {
    for (const file of await cronRouteFiles()) {
      const src = readFileSync(resolve(APP_API_CRON, file), 'utf8');
      expect(
        src,
        `${file} exports no GET — Vercel Cron would answer 405 and the job would never run`,
      ).toMatch(/export async function GET\b/);
    }
  });

  it('every cron route still runs on the node runtime', async () => {
    for (const file of await cronRouteFiles()) {
      const src = readFileSync(resolve(APP_API_CRON, file), 'utf8');
      expect(src, `${file} must pin runtime = 'nodejs'`).toMatch(/export const runtime = 'nodejs'/);
    }
  });

  it('every cron route gates on verifyCronSecret', async () => {
    for (const file of await cronRouteFiles()) {
      const src = readFileSync(resolve(APP_API_CRON, file), 'utf8');
      expect(src, `${file} must call verifyCronSecret`).toMatch(/verifyCronSecret\(/);
    }
  });
});
