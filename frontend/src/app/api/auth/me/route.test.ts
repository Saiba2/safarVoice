// Tests for GET /api/auth/me (AUTH-06).
// Pattern 14. requireAuth-gated. Note: requireAuth uses cookies() from
// next/headers internally, so tests must use mockNextCookies + prismaMock.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '@/test-utils/prisma-mock';
import { mockNextCookies, __cookieStore } from '@/test-utils/mock-cookies';

mockNextCookies();

vi.mock('@/lib/server/auth', async () => {
  const actual = await vi.importActual<typeof import('@/lib/server/auth')>('@/lib/server/auth');
  return {
    ...actual,
    verifyToken: vi.fn(),
  };
});

import { verifyToken } from '@/lib/server/auth';
import { GET, PATCH } from './route';
import { NextRequest } from 'next/server';

function makeReq(opts: { tokenCookie?: string; bearer?: string } = {}): NextRequest {
  const headers: Record<string, string> = {};
  if (opts.bearer) headers.authorization = `Bearer ${opts.bearer}`;
  return new NextRequest('https://test/api/auth/me', {
    method: 'GET',
    headers,
  });
}

beforeEach(() => {
  __cookieStore.clear();
  vi.mocked(verifyToken).mockReset();
});

describe('GET /api/auth/me', () => {
  it('Test 1: authed — returns user identity', async () => {
    // Place token cookie via mock store; requireAuth reads it via cookies().
    __cookieStore.clear();
    // Fake cookies.set: use mockStore via the mock-cookies internal store.
    // Simpler: test injects directly through Bearer header path which
    // requireAuth supports as a fallback when no cookie is present.
    vi.mocked(verifyToken).mockResolvedValue({
      sub: 'u1',
      email: 'a@b.com',
      tokenVersion: 0,
    });
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      tokenVersion: 0,
    } as never);

    const res = await GET(makeReq({ bearer: 'valid-access-token' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      user: { sub: 'u1', email: 'a@b.com' },
    });
  });

  it('Test 2: no cookie + no bearer — 401 missing token', async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/Missing token|token/i);
  });

  it('Test 3: stale tokenVersion — 401', async () => {
    vi.mocked(verifyToken).mockResolvedValue({
      sub: 'u1',
      email: 'a@b.com',
      tokenVersion: 0,
    });
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      tokenVersion: 1, // bumped via change-password
    } as never);

    const res = await GET(makeReq({ bearer: 'stale-jwt' }));
    expect(res.status).toBe(401);
  });

  it('Test 4: deleted user — 401', async () => {
    vi.mocked(verifyToken).mockResolvedValue({
      sub: 'u-deleted',
      email: 'gone@b.com',
      tokenVersion: 0,
    });
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await GET(makeReq({ bearer: 'orphan-jwt' }));
    expect(res.status).toBe(401);
  });
});

// --- PATCH /api/auth/me ---------------------------------------------------
// Added with the "Paramètres du profil" screen. Covers the CSRF gate, the
// validation boundaries, and the absent-vs-null distinction that lets the
// caller clear one field without touching the others.

function makePatch(
  body: unknown,
  opts: { csrf?: 'match' | 'missing'; bearer?: string } = {},
): NextRequest {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if ((opts.csrf ?? 'match') === 'match') {
    headers['x-csrf-token'] = 'csrf-tok';
    headers['cookie'] = 'app-csrf=csrf-tok';
  }
  headers.authorization = `Bearer ${opts.bearer ?? 'valid-access-token'}`;
  return new NextRequest('https://test/api/auth/me', {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
}

function authed(): void {
  vi.mocked(verifyToken).mockResolvedValue({ sub: 'u1', email: 'a@b.com', tokenVersion: 0 });
}

describe('PATCH /api/auth/me', () => {
  beforeEach(() => {
    prismaMock.user.update.mockReset();
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      tokenVersion: 0,
    } as never);
  });

  it('rejects a request without the CSRF header', async () => {
    authed();
    const res = await PATCH(makePatch({ name: 'Awa' }, { csrf: 'missing' }));
    expect(res.status).toBe(403);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('updates only the fields present in the body', async () => {
    authed();
    prismaMock.user.update.mockResolvedValue({
      name: 'Awa Diop',
      avatarUrl: null,
      country: 'SN',
      preferredLanguage: null,
    } as never);

    const res = await PATCH(makePatch({ name: 'Awa Diop', country: 'sn' }));
    expect(res.status).toBe(200);

    const arg = prismaMock.user.update.mock.calls[0]?.[0] as { data: Record<string, unknown> };
    // country is upper-cased; the two untouched fields must not appear at all,
    // otherwise they would be written as null.
    expect(arg.data).toEqual({ name: 'Awa Diop', country: 'SN' });
    expect('avatarUrl' in arg.data).toBe(false);
    expect('preferredLanguage' in arg.data).toBe(false);
  });

  it('clears a field when it is explicitly null', async () => {
    authed();
    prismaMock.user.update.mockResolvedValue({
      name: null,
      avatarUrl: null,
      country: null,
      preferredLanguage: null,
    } as never);

    const res = await PATCH(makePatch({ name: null }));
    expect(res.status).toBe(200);
    const arg = prismaMock.user.update.mock.calls[0]?.[0] as { data: Record<string, unknown> };
    expect(arg.data).toEqual({ name: null });
  });

  it('rejects an empty body rather than issuing a no-op update', async () => {
    authed();
    const res = await PATCH(makePatch({}));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('rejects a country that is not two letters', async () => {
    authed();
    const res = await PATCH(makePatch({ country: 'SEN' }));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('rejects an avatarUrl that is not a URL', async () => {
    authed();
    const res = await PATCH(makePatch({ avatarUrl: 'not-a-url' }));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('rejects a caller whose account no longer exists', async () => {
    // Same shape as GET Test 4: the token verifies, but requireAuth's DB
    // re-check finds nothing, so the request is refused before any write.
    authed();
    prismaMock.user.findUnique.mockResolvedValue(null);
    const res = await PATCH(makePatch({ name: 'Awa' }));
    expect(res.status).toBe(401);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});
