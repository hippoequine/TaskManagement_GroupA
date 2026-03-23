import express from 'express';
import cors from 'cors';
import issuesRouter from './routes/issues.js';
import projectRoutes from './routes/projectRoutes.js';
import boardRoutes from './routes/boards.js';

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Mock user for testing - this bypasses the auth middleware
app.use((req, res, next) => {
  console.log('Middleware running for:', req.method, req.path);

  // Mock Keycloak user (what auth middleware would set)
  req.user = {
    sub: '31a72426-3f36-4ba9-af6c-cb942643874a',
    email: 'test@example.com',
    name: 'Test User',
    preferred_username: 'testuser',
    roles: ['developer'],
  };

  // Mock database user (for permissions middleware)
  req.dbUser = {
    id: '31a72426-3f36-4ba9-af6c-cb942643874a',
    role: 'developer',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
  };

  next();
});

// Mount routes directly (bypassing the auth middleware in api.js)
app.use('/api/issues', issuesRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/boards', boardRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export default app;
