import {
  Box,
  Breadcrumbs,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link, Outlet, useNavigate, useParams } from 'react-router';
import { useBoard } from '../context/BoardContext';
import { useProject } from '../context/ProjectContext';

export default function Boards() {
  const { boardId, projectId } = useParams();
  const { currentProject: project } = useProject();

  const navigate = useNavigate();
  const { boards } = useBoard();
  if (!boardId) {
    return (
      <Box sx={{ p: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            to="/projects"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Projects
          </Link>
          <Link
            to={`/projects/${project.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {project.name}
          </Link>
          <Typography color="text.primary">Boards</Typography>
        </Breadcrumbs>

        <List>
          {boards.map((b) => (
            <ListItem key={b.id}>
              <ListItemButton
                onClick={() => navigate(`/projects/${projectId}/board/${b.id}`)}
              >
                <ListItemText primary={b.id} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }
  return <Outlet />;
}
