/**
 * Relative time in French — "à l'instant", "il y a 2 heures", "hier".
 *
 * Intl.RelativeTimeFormat does the wording, including the irregular cases
 * ("hier", "la semaine dernière") that a hand-rolled formatter gets wrong.
 * This only picks the unit.
 *
 * Call it from client code only: the value depends on the current time, so
 * rendering it on the server produces markup the client immediately
 * contradicts.
 */
const formatter = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const seconds = Math.round((then - now.getTime()) / 1000);
  const magnitude = Math.abs(seconds);

  // Under a minute reads better as a phrase than as "il y a 0 minute".
  if (magnitude < 45) return "à l'instant";
  if (magnitude < HOUR) return formatter.format(Math.round(seconds / MINUTE), 'minute');
  if (magnitude < DAY) return formatter.format(Math.round(seconds / HOUR), 'hour');
  if (magnitude < WEEK) return formatter.format(Math.round(seconds / DAY), 'day');
  if (magnitude < MONTH) return formatter.format(Math.round(seconds / WEEK), 'week');
  return formatter.format(Math.round(seconds / MONTH), 'month');
}
