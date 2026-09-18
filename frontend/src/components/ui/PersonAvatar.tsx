'use client';

import { useState } from 'react';

import InitialsAvatar from './InitialsAvatar';
import { cn } from '@/lib/utils';

/**
 * Portrait for a named person or voice: shows the photo when one exists,
 * falls back to initials otherwise.
 *
 * The fallback is not cosmetic. These photos are dropped into public/ by
 * hand, so a missing or misnamed file is the normal failure — and a broken
 * image icon on the landing page is worse than initials. onError catches it
 * at runtime, which also covers a file that exists but fails to decode.
 *
 * Plain <img> rather than next/image: these are small fixed-size avatars
 * served from public/, so the optimisation pipeline buys nothing, and
 * next/image has no equivalent of this error fallback.
 */
export default function PersonAvatar({
  name,
  src,
  className,
}: {
  name: string;
  /** Path under public/, e.g. "/voices/awa.jpg". Omit to always use initials. */
  src?: string | undefined;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <InitialsAvatar name={name} className={className} />;
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className={cn('shrink-0 rounded-full object-cover', className ?? 'h-8 w-8')}
    />
  );
}
