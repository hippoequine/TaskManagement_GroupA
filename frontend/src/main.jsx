import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout.jsx';
import Boards from './pages/Boards.jsx';
import Projects from './pages/Projects.jsx';

import { CircularProgress } from '@mui/material';
import './api/axios.js';
import App from './App.jsx';
import AuthProvider from './auth/AuthProvider.jsx';
import useAuth from './auth/useAuth.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ProjectProvider } from './context/ProjectContext.jsx';
import './index.css';
import keycloak from './keycloak.js';
import BoardLayout from './layouts/BoardLayout.jsx';
import ProjectLayout from './layouts/ProjectLayout.jsx';
import Board from './pages/Board.jsx';
import ProjectOverview from './pages/ProjectOverview.jsx';
import Project from './pages/Project.jsx';

setInterval(() => {
  if (keycloak.authenticated) {
    keycloak.updateToken(30).catch(() => {
      keycloak.logout();
    });
  }
}, 10000);

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) return <CircularProgress />;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProjectProvider>
            <RootLayout />
          </ProjectProvider>
        }
      >
        <Route index element={<App />} />

        <Route element={<ProtectedRoute />}>
          <Route path="projects" element={<ProjectLayout />}>
            <Route index element={<Projects />} />

            <Route path=":projectId" element={<Project />}>
              <Route index element={<ProjectOverview />} />

              <Route path="board" element={<BoardLayout />}>
                <Route index element={<Boards />} />

                <Route path=":boardId">
                  <Route index element={<Board />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

keycloak
  .init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri:
      window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
    checkLoginIframe: true,
    checkLoginIframeInterval: 30,
  })
  .then(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </StrictMode>
    );
  })
  .catch((err) => {
    console.error('Keycloak init failed: ', err);
  });
