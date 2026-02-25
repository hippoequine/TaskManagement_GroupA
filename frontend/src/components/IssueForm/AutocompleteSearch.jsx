import { useState, useEffect } from 'react';

function AutocompleteSearch(endpoint, query) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`${endpoint}?search=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then(setResults)
        .catch((err) => {
          if (err.name !== 'AbortError') console.error(err);
        });
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [endpoint, query]);

  return results;
}
export default AutocompleteSearch;
