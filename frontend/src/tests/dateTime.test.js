import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  formatDateTime,
  formatDueDate,
  datePickerValueToDueAtUtcIso,
  getRelativeDueTime,
} from '../utils/dateTime';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const describeIf = (cond) => (cond ? describe : describe.skip);

describe('dateTime utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-20T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  // -----------------------------
  // formatDateTime
  // -----------------------------
  describe('formatDateTime', () => {
    it('returns fallback for null/invalid', () => {
      expect(formatDateTime(null)).toBe('-');
      expect(formatDateTime('bad-date')).toBe('-');
    });

    describeIf(process.env.TZ === 'UTC')('formatDateTime in UTC', () => {
      it('formats correctly', () => {
        const iso = '2026-02-20T23:59:59.999Z';
        expect(formatDateTime(iso, { format: 'YYYY-MM-DD HH:mm' })).toBe(
          '2026-02-20 23:59'
        );
      });
    });

    describeIf(process.env.TZ === 'America/New_York')(
      'formatDateTime in NY',
      () => {
        it('formats correctly', () => {
          const iso = '2026-02-20T23:59:59.999Z';
          expect(formatDateTime(iso, { format: 'YYYY-MM-DD HH:mm' })).toBe(
            '2026-02-20 18:59'
          );
        });
      }
    );

    describeIf(process.env.TZ === 'Europe/London')(
      'formatDateTime in London',
      () => {
        it('formats correctly', () => {
          const iso = '2026-02-20T23:59:59.999Z';
          expect(formatDateTime(iso, { format: 'YYYY-MM-DD HH:mm' })).toBe(
            '2026-02-20 23:59'
          );
        });
      }
    );
  });

  // -----------------------------
  // formatDueDate
  // -----------------------------
  describe('formatDueDate', () => {
    it('returns fallback for null', () => {
      expect(formatDueDate(null)).toBe('-');
    });

    describeIf(process.env.TZ === 'UTC')('in TZ=UTC', () => {
      it('formats due date as local date (UTC)', () => {
        const iso = '2026-02-20T23:59:59.999Z';
        expect(formatDueDate(iso, { format: 'YYYY-MM-DD' })).toBe('2026-02-20');
      });
    });

    describeIf(process.env.TZ === 'America/New_York')(
      'in TZ=America/New_York',
      () => {
        it('formats due date as local date (NY)', () => {
          const iso = '2026-02-20T23:59:59.999Z';
          // 23:59Z is still Feb 20 in NY (18:59 local), so date remains Feb 20
          expect(formatDueDate(iso, { format: 'YYYY-MM-DD' })).toBe(
            '2026-02-20'
          );
        });
      }
    );

    describeIf(process.env.TZ === 'Europe/London')(
      'in TZ=Europe/London',
      () => {
        it('formats due date as local date (London)', () => {
          const iso = '2026-02-20T23:59:59.999Z';
          // Feb 20 23:59Z is Feb 20 23:59 in London (UTC+0 in winter)
          expect(formatDueDate(iso, { format: 'YYYY-MM-DD' })).toBe(
            '2026-02-20'
          );
        });
      }
    );
  });

  // -----------------------------
  // datePickerValueToDueAtUtcIso
  // -----------------------------
  describe('datePickerValueToDueAtUtcIso', () => {
    it('returns null for null input', () => {
      expect(datePickerValueToDueAtUtcIso(null)).toBeNull();
    });

    describeIf(process.env.TZ === 'UTC')('in TZ=UTC', () => {
      it('converts picked date to 23:59:59.999Z same day', () => {
        const picked = dayjs('2026-02-20');
        expect(datePickerValueToDueAtUtcIso(picked)).toBe(
          '2026-02-20T23:59:59.999Z'
        );
      });
    });

    describeIf(process.env.TZ === 'America/New_York')(
      'in TZ=America/New_York',
      () => {
        it('shifts to next day UTC (local end-of-day becomes next-day UTC)', () => {
          const picked = dayjs('2026-02-20');
          // Feb 20 23:59:59.999 in NY (UTC-5) -> Feb 21 04:59:59.999Z
          expect(datePickerValueToDueAtUtcIso(picked)).toBe(
            '2026-02-21T04:59:59.999Z'
          );
        });
      }
    );

    describeIf(process.env.TZ === 'Europe/London')(
      'in TZ=Europe/London',
      () => {
        it('keeps same-day UTC when local timezone is GMT', () => {
          const picked = dayjs('2026-02-20');
          // Feb 20 23:59:59.999 in London (UTC+0)
          // -> Feb 20 23:59:59.999Z (no shift)
          expect(datePickerValueToDueAtUtcIso(picked)).toBe(
            '2026-02-20T23:59:59.999Z'
          );
        });
      }
    );
  });

  describe('getRelativeDueTime', () => {
    it('returns empty string for null/invalid', () => {
      expect(getRelativeDueTime(null)).toBe('');
      expect(getRelativeDueTime('bad')).toBe('');
    });

    it('returns correct future relative time', () => {
      const now = '2026-02-18T00:00:00.000Z';
      const iso = '2026-02-20T23:59:59.999Z';
      expect(getRelativeDueTime(iso, { now })).toBe('in 3 days');
    });

    it('returns correct past relative time', () => {
      const now = '2026-02-20T00:00:00.000Z';
      const iso = '2026-02-18T12:00:00.000Z';
      expect(getRelativeDueTime(iso, { now })).toBe('2 days ago');
    });
  });
});
