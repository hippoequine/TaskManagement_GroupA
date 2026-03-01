import { useState, useEffect } from 'react';
import api from '../../api/axios';

function AutocompleteSearch(endpoint, query) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      api
        .get(endpoint, { params: { q: query }, signal: controller.signal })
        .then((res) => {
          setResults(res.data);
        })
        .catch((err) => {
          if (err.name !== 'CanceledError') console.error(err);
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
