import React, { useState } from 'react';
import axios from '../api/axios';

export default function DeleteIssueButton({ issueId, onDeleted, className }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure?');
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/issues/${issueId}`);
      if (onDeleted) onDeleted(issueId);
    } catch (e) {
      const message = (e && e.response && e.response.data && e.response.data.message) || e.message || 'Delete failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button type="button" onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
