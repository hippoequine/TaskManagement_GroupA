import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(relativeTime);

function formatBase(iso, fallback, format) {
  if (!iso) return fallback;
  const d = dayjs.utc(iso);
  return d.isValid() ? d.local().format(format) : fallback;
}

/**
 * Format an ISO datetime (UTC or with offset) for display in the user's local timezone.
 * Intended for timestamps such as:
 * - comment.createdAt
 * - issue due date
 * - any stored UTC instant
 *
 * The input ISO string is assumed to represent a UTC instant.
 * The value is converted to the viewer's local timezone before formatting.
 *
 * @param {string|null|undefined} iso - ISO string (e.g. "2026-02-20T23:59:59.999Z")
 * @param {string} [options.fallback='—'] - text when iso is null/invalid
 * @param {string} [options.format='MMM D, YYYY h:mm A'] - dayjs format string
 * @returns {string} Formatted local datetime string or fallback.
 */
export function formatDateTime(
  iso,
  { fallback = '-', format = 'MMM D, YYYY h:mm A' } = {}
) {
  return formatBase(iso, fallback, format);
}

/**
 * Format a stored due-date instant for display in the viewer's local timezone.
 * This assumes "deadline instant" semantics:
 * - The due date is stored as a UTC instant
 * - Typically derived from end-of-day in the creator's timezone
 * - Displayed in the viewer's local timezone
 *
 * @param {string|null|undefined} iso - ISO string representing a stored UTC deadline.
 * @param {string} [options.fallback='—'] - Text returned if iso is null, undefined, or invalid.
 * @param {string} [options.format='MMM D, YYYY'] - Dayjs format string used for output.
 * @returns {string} Formatted local date string or fallback.
 */
export function formatDueDate(
  iso,
  { fallback = '-', format = 'MMM D, YYYY' } = {}
) {
  return formatBase(iso, fallback, format);
}

/**
 * Convert a value returned from MUI DatePicker into a UTC ISO string
 * representing a "deadline instant".
 *
 * Policy:
 * - Interpret selected date as END OF DAY in the user's local timezone.
 * - Convert that local end-of-day to UTC.
 * - Return an ISO string suitable for backend storage.
 *
 * Example:
 * User selects Feb 20.
 * -> Interpreted as Feb 20 23:59:59.999 (local)
 * -> Converted to UTC
 * -> Stored as ISO string (e.g. "2026-02-21T07:59:59.999Z")
 *
 * @param {*} dayjsValue - Dayjs value returned from MUI DatePicker (or null).
 * @returns {string|null} ISO string in UTC or null
 */
export function datePickerValueToDueAtUtcIso(dayjsValue) {
  if (!dayjsValue) return null;
  const d = dayjs(dayjsValue); // Ensures input is wrapped
  if (!d.isValid()) return null;
  return d.endOf('day').utc().toISOString();
}

/**
 * Return a human-readable relative time string for a deadline instant.
 *
 * Intended for deadline context such as:
 * - "in 2 days"
 * - "3 hours ago"
 *
 * The input ISO string is assumed to represent a UTC instant.
 * The value is converted to the viewer's local timezone before calculating
 * the relative time difference.
 *
 * Examples:
 *   getRelativeDueTime("2026-02-20T23:59:59.999Z")
 *   -> "in 2 days"
 *
 * @param {string|null|undefined} iso - ISO string representing a stored UTC instant.
 * @param {string|Date|import('dayjs').Dayjs} [options.now] - reference "now" for deterministic tests
 * @param {boolean} [options.withSuffix=true] - include "ago"/"in"
 * @returns {string} - Relative time string (e.g. "in 2 days", "5 hours ago"), or empty string if input is null/invalid.
 */
export function getRelativeDueTime(iso, { now, withSuffix = true } = {}) {
  if (!iso) return '';
  const d = dayjs.utc(iso);
  if (!d.isValid()) return '';

  // If no reference 'now' is provided, dayjs handles the comparison to 'now' automatically
  if (!now) return d.fromNow(!withSuffix);

  const ref = dayjs.utc(now);
  if (!ref.isValid()) return d.fromNow(!withSuffix);

  // dayjs.from(reference, withoutSuffix)
  return d.from(ref, !withSuffix);
}
