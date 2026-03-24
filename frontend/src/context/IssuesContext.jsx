import { createContext, useCallback, useEffect, useState } from 'react';
import { issuesApi } from '../api/issuesApi';
import { useProject } from './ProjectContext';
import { useBoard } from './BoardContext';
import { useContext } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

const IssuesContext = createContext(null);

export function IssuesProvider({ children }) {
  const { currentProject } = useProject();
  const { currentBoard } = useBoard();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const fetchIssues = useCallback(async () => {
    if (!currentProject?.id || !currentBoard?.id) {
      setIssues([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await issuesApi.getAll(currentBoard.id);
      setIssues(data.issues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id, currentBoard?.id]);

  const updateIssue = useCallback(
    async (issueId, changes) => {
      if (!currentProject?.id || !currentBoard?.id) return;

      setUpdatingIds((prev) => new Set([...prev, issueId]));
      try {
        const { data } = await issuesApi.update(issueId, changes);

        if (data && data.issue) {
          setIssues((prev) =>
            prev.map((t) => (t.id === issueId ? data.issue : t))
          );
        } else {
          await fetchIssues();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setUpdatingIds(
          (prev) => new Set([...prev].filter((id) => id !== issueId))
        );
      }
    },
    [currentProject?.id, currentBoard?.id, fetchIssues]
  );

  // For drag-n-drop status changes w/ optimistic update
  const moveIssue = useCallback(
    async (issueId, newStatus, targetIndex = null) => {
      const previousIssues = [...issues];

      // Optimistic update with position support
      setIssues((prev) => {
        // Remove issue from current position
        const issueToMove = prev.find((i) => i.id === issueId);
        if (!issueToMove) return prev;

        const withoutIssue = prev.filter((i) => i.id !== issueId);
        const updatedIssue = { ...issueToMove, status: newStatus };

        if (targetIndex !== null) {
          // Insert at specific position in target column
          const targetColumnIssues = withoutIssue.filter(
            (i) => i.status === newStatus
          );
          const otherIssues = withoutIssue.filter(
            (i) => i.status !== newStatus
          );

          // Insert at targetIndex
          const newColumnIssues = [
            ...targetColumnIssues.slice(0, targetIndex),
            updatedIssue,
            ...targetColumnIssues.slice(targetIndex),
          ];

          return [...otherIssues, ...newColumnIssues];
        } else {
          // Append to end of column
          return [...withoutIssue, updatedIssue];
        }
      });

      // Skips API call if using mock data
      if (!currentProject?.id || !currentBoard?.id) {
        return;
      }

      // Persist to backend
      setUpdatingIds((prev) => new Set([...prev, issueId]));
      try {
        await issuesApi.update(issueId, { status: newStatus });
      } catch (err) {
        // Rollback on error
        setIssues(previousIssues);
        // Extract error message from response if available
        const errorMessage = err.response?.data?.error || err.message;
        setError(errorMessage);
      } finally {
        setUpdatingIds(
          (prev) => new Set([...prev].filter((id) => id !== issueId))
        );
      }
    },
    [issues, currentProject?.id, currentBoard?.id]
  );

  const deleteIssue = useCallback(
    async (issueId) => {
      try {
        await issuesApi.delete(issueId);
      } catch (e) {
        setError(e);
      }
    },
    [issuesApi]
  );

  // For within-column reordering
  const reorderIssues = useCallback(
    async (columnId, oldIndex, newIndex) => {
      // Gets issues in this column
      const columnIssues = issues.filter((t) => t.status === columnId);
      const otherIssues = issues.filter((t) => t.status !== columnId);
      // Reorders the column issues
      const reorderedColumnIssues = arrayMove(columnIssues, oldIndex, newIndex);
      // Combines them back together
      const newIssues = [...otherIssues, ...reorderedColumnIssues];
      // Optimistic update
      setIssues(newIssues);

      // Skips API call if using mock data
      if (!currentProject?.id || !currentBoard?.id) {
        return;
      }
    },
    [issues, currentProject?.id, currentBoard?.id]
  );

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <IssuesContext.Provider
      value={{
        issues,
        setIssues,
        loading,
        error,
        setError,
        fetchIssues,
        deleteIssue,
        updateIssue,
        updatingIds,
        moveIssue,
        reorderIssues,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
}

export const useIssues = () => useContext(IssuesContext);

export function useAllIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const { data } = await issuesApi.getAllIssues();

        setIssues(data.issues);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  return { issues, loading, error };
}
