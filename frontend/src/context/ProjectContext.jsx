import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { projectsApi } from '../api/projectsApi';

import useAuth from '../auth/useAuth';
import { useMatch, useNavigate } from 'react-router';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const match = useMatch('/projects/:projectId/*');
  const projectIdFromUrl = match?.params?.projectId;

  const currentProject = projects.find(
    (p) => String(p.id) === String(projectIdFromUrl)
  );

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await projectsApi.getAll();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const switchProject = useCallback(
    (project) => {
      navigate(`/projects/${project.id}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [fetchProjects, isAuthenticated]);

  return (
    <ProjectContext.Provider
      value={{ projects, currentProject, loading, error, switchProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);
