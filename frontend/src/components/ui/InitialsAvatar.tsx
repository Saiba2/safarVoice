import { cn } from '@/lib/utils';

/**
 * Circular avatar showing a person's initials.
 *
 * Banani's mockups use its proprietary <UserAvatar> illustration component,
 * which generates a face from gender/age/heritage props. It has no equivalent
 * here, and inventing faces for real users would be worse than initials. Once
 * avatars are uploaded through Cloudinary, this becomes the fallback for users
 * without one.
 */
export default function InitialsAvatar({
  name,
  className,
}: {
  name: string | null;
  // `| undefined` is explicit because exactOptionalPropertyTypes is on and
  // callers forward an optional className straight through.
  className?: string | undefined;
}) {
  const initials = (name ?? '')
    // Split on spaces, and on @ / . so an email yields sensible letters.
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground',
        className ?? 'h-8 w-8 text-xs',
      )}
    >
      {initials || '?'}
    </div>
  );
}
