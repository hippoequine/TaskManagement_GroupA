import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AutocompleteSearch from '../components/IssueForm/AutocompleteSearch';
import api from '../api/axios';

vi.mock('../api/axios', () => ({
  default: { get: vi.fn() },
}));

describe('AutocompleteSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('returns an empty array when the query is empty', () => {
    const { result } = renderHook(() => AutocompleteSearch('/search', ''));

    expect(result.current).toEqual([]);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('fetches results after a 300ms debounce', async () => {
    api.get.mockResolvedValue({ data: ['apple', 'apricot'] });

    const { result } = renderHook(() => AutocompleteSearch('/search', 'app'));

    expect(api.get).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });

    expect(result.current).toEqual(['apple', 'apricot']);

    expect(api.get).toHaveBeenCalledWith('/search', {
      params: { q: 'app' },
      signal: expect.any(AbortSignal),
    });
  });

  it('clears results when query is emptied', async () => {
    api.get.mockResolvedValue({ data: ['apple'] });

    const { result, rerender } = renderHook(
      ({ query }) => AutocompleteSearch('/search', query),
      { initialProps: { query: 'app' } }
    );

    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });

    expect(result.current).toEqual(['apple']);

    rerender({ query: '' });
    expect(result.current).toEqual([]);
  });

  it('silently ignores CanceledError from aborted requests', async () => {
    const canceledError = new Error('canceled');
    canceledError.name = 'CanceledError';
    api.get.mockRejectedValue(canceledError);

    const consoleSpy = vi.spyOn(console, 'error');

    const { unmount } = renderHook(() => AutocompleteSearch('/search', 'test'));

    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    unmount();

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
