import { Outlet, useOutletContext } from 'react-router';
import { BoardProvider } from '../context/BoardContext';
import { TasksProvider } from '../context/TasksContext';

export default function BoardLayout() {
  const { project } = useOutletContext();

  return (
    <BoardProvider>
      <TasksProvider>
        <Outlet context={{ project }} />
      </TasksProvider>
    </BoardProvider>
  );
}
