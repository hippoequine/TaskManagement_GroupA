import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';

import { useProject } from './ProjectContext';
import { boardsApi } from '../api/boardsApi';
import { useNavigate, useMatch } from 'react-router';

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const navigate = useNavigate();
  const { currentProject } = useProject();

  const match = useMatch('/projects/:projectId/board/:boardId/*');
  const boardIdFromUrl = match?.params?.boardId;

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentBoard = useMemo(() => {
    if (!boardIdFromUrl || boards.length === 0) return null;
    return boards.find((b) => String(b.id) === String(boardIdFromUrl)) || null;
  }, [boards, boardIdFromUrl]);

  const fetchBoards = useCallback(async () => {
    if (!currentProject?.id) {
      setBoards([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await boardsApi.getAll(currentProject.id);
      setBoards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  const switchBoard = useCallback(
    (board) => {
      if (currentProject?.id && board?.id) {
        navigate(`/projects/${currentProject.id}/board/${board.id}`);
      }
    },
    [navigate, currentProject?.id]
  );

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return (
    <BoardContext.Provider
      value={{ boards, currentBoard, loading, error, switchBoard }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);
