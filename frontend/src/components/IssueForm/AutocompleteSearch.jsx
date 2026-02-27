import { useState, useEffect } from 'react';
import axios from 'axios';

function AutocompleteSearch(endpoint, query) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      axios
        .get(endpoint, { params: { search: query }, signal: controller.signal })
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
