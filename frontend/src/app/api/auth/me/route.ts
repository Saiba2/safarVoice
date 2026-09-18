// GET /api/auth/me — AUTH-06.
//
// Source: RESEARCH.md Pattern 14.
//
// requireAuth handles the cookie/Bearer lookup, JWT verification, and the
// DB-side tokenVersion re-check (T-1-02 mitigation against stale-JWT bypass
// after change-password bumps tokenVersion). Returns AuthContext on success
// or a 401 NextResponse on failure.
//
// Extra fields beyond { sub, email } (id, emailVerifiedAt, createdAt,
// updatedAt, hasPassword, linkedProviders) are fetched via a second DB hit
// so the AuthContext / settings page can branch on them without an extra
// round-trip. `hasPassword` distinguishes OAuth-only accounts (passwordHash
// is null) — used by /settings to switch between "Set password" and
// "Change password". `linkedProviders` is a string[] of provider names
// already wired (e.g. ['google']).
//
// No CSRF: GET is a safe method; verifyCsrf is a no-op for GET anyway.
export const runtime = 'nodejs';

import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { prisma } from '@/lib/server/prisma';
import { log } from '@/lib/server/observability/log';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth(req.headers.get('authorization'));
    if (auth instanceof NextResponse) {
      auth.headers.set('x-request-id', ctx.requestId);
      return auth;
    }

    // Defensive shape: tests sometimes stub findUnique with a minimal
    // `{ id, email, tokenVersion }` payload (the requireAuth contract).
    // We only read fields we know are present, and default the rest.
    const dbUser = await prisma.user.findUnique({
      where: { id: auth.user.sub },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: true,
        // Display name and avatar drive the sidebar and profile screens.
        // Both are nullable: email/password signups never populate them.
        name: true,
        avatarUrl: true,
        country: true,
        preferredLanguage: true,
        oauthAccounts: { select: { provider: true } },
      },
    });

    const user = {
      // Keep `sub` for back-compat with the AuthContext payload contract
      // (older callers may still read it). New code should use `id`.
      sub: auth.user.sub,
      id: dbUser?.id ?? auth.user.sub,
      email: dbUser?.email ?? auth.user.email,
      emailVerifiedAt: dbUser?.emailVerifiedAt
        ? dbUser.emailVerifiedAt instanceof Date
          ? dbUser.emailVerifiedAt.toISOString()
          : dbUser.emailVerifiedAt
        : null,
      createdAt: dbUser?.createdAt
        ? dbUser.createdAt instanceof Date
          ? dbUser.createdAt.toISOString()
          : dbUser.createdAt
        : null,
      updatedAt: dbUser?.updatedAt
        ? dbUser.updatedAt instanceof Date
          ? dbUser.updatedAt.toISOString()
          : dbUser.updatedAt
        : null,
      name: dbUser?.name ?? null,
      avatarUrl: dbUser?.avatarUrl ?? null,
      country: dbUser?.country ?? null,
      preferredLanguage: dbUser?.preferredLanguage ?? null,
      hasPassword: !!dbUser?.passwordHash,
      linkedProviders: (dbUser?.oauthAccounts ?? []).map((a) => a.provider),
    };

    return NextResponse.json({ user }, { status: 200, headers: { 'x-request-id': ctx.requestId } });
  });
}

// PATCH /api/auth/me — update the caller's own profile.
//
// Added for the "Paramètres du profil" screen, which needs a way to persist
// the display name, avatar, country and interface language. Only these four
// fields are writable: email changes must go through a verification flow,
// and role/status are admin-only (see /api/admin/users/[id]/role).
//
// Every field is optional and nullable — sending `{ "name": null }` clears
// the name, while omitting a key leaves it untouched. The two are different
// operations, which is why the schema distinguishes "absent" from "null".
const PatchBody = z
  .object({
    name: z.string().trim().min(1).max(120).nullable().optional(),
    avatarUrl: z.string().url().max(2048).nullable().optional(),
    // ISO 3166-1 alpha-2, upper-cased on the way in so "sn" and "SN" agree.
    country: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{2}$/)
      .nullable()
      .optional(),
    // BCP 47, kept short: "fr", "fr-SN", "wo".
    preferredLanguage: z.string().trim().min(2).max(35).nullable().optional(),
  })
  // An empty body would issue a pointless UPDATE and return 200, which reads
  // as success to the caller. Reject it instead.
  .refine((v) => Object.keys(v).length > 0, { message: 'No field to update' });

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrfFail = verifyCsrf(req);
    if (csrfFail) {
      csrfFail.headers.set('x-request-id', ctx.requestId);
      return csrfFail;
    }

    const auth = await requireAuth(req.headers.get('authorization'));
    if (auth instanceof NextResponse) {
      auth.headers.set('x-request-id', ctx.requestId);
      return auth;
    }

    const body = await req.json().catch(() => null);
    const parsed = PatchBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', message: 'Invalid request body' },
        { status: 400, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    // Build the update from present keys only, so an omitted field is not
    // overwritten with undefined.
    const data: Prisma.UserUpdateInput = {};
    if ('name' in parsed.data) data.name = parsed.data.name ?? null;
    if ('avatarUrl' in parsed.data) data.avatarUrl = parsed.data.avatarUrl ?? null;
    if ('country' in parsed.data) {
      data.country = parsed.data.country ? parsed.data.country.toUpperCase() : null;
    }
    if ('preferredLanguage' in parsed.data) {
      data.preferredLanguage = parsed.data.preferredLanguage ?? null;
    }

    const updated = await prisma.user.update({
      where: { id: auth.user.sub },
      data,
      select: { name: true, avatarUrl: true, country: true, preferredLanguage: true },
    });

    log.info('profile updated', { userId: auth.user.sub, fields: Object.keys(data) });

    return NextResponse.json(
      { user: updated },
      { status: 200, headers: { 'x-request-id': ctx.requestId } },
    );
  });
}
