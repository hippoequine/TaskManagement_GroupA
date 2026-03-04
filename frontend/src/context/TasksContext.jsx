import { createContext, useCallback, useEffect, useState } from 'react';
import { tasksApi } from '../api/tasksApi';
import { useProject } from './ProjectContext';
import { useBoard } from './BoardContext';
import { useContext } from 'react';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const { currentProject } = useProject();
  const { currentBoard } = useBoard();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const fetchTasks = useCallback(async () => {
    if (!currentProject?.id || !currentBoard?.id) {
      setTasks([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await tasksApi.getAll(
        currentProject.id,
        currentBoard.id
      );
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id, currentBoard?.id]);

  const updateTask = useCallback(
    async (taskId, changes) => {
      if (!currentProject?.id || !currentBoard?.id) return;

      setUpdatingIds((prev) => new Set([...prev, taskId]));
      try {
        await tasksApi.update(
          currentProject.id,
          currentBoard.id,
          taskId,
          changes
        );
        await fetchTasks();
      } catch (err) {
        setError(err.message);
      } finally {
        setUpdatingIds(
          (prev) => new Set([...prev].filter((id) => id !== taskId))
        );
      }
    },
    [currentProject?.id, currentBoard?.id, fetchTasks]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TasksContext.Provider
      value={{ tasks, loading, error, fetchTasks, updateTask, updatingIds }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => useContext(TasksContext);
