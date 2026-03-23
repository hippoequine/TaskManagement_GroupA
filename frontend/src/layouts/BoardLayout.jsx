import { Outlet, useOutletContext } from 'react-router';
import { BoardProvider } from '../context/BoardContext';
import { IssuesProvider } from '../context/IssuesContext.jsx';

export default function BoardLayout() {
  const { project } = useOutletContext();

  return (
    <BoardProvider>
      <IssuesProvider>
        <Outlet context={{ project }} />
      </IssuesProvider>
    </BoardProvider>
  );
}
