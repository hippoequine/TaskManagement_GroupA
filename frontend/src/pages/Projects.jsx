import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router';
import { useProject } from '../context/ProjectContext';

export default function Projects() {
  const navigate = useNavigate();
  const { projects } = useProject();

  return (
    <List>
      {projects.map((p) => (
        <ListItem key={p.id}>
          <ListItemButton onClick={() => navigate(`/projects/${p.id}`)}>
            <ListItemText primary={p.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
