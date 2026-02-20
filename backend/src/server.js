import express from 'express';
import cors from 'cors';
import { initKeycloak } from './config/keycloak.js';
import sequelize from './config/db.js';
import './models/models.js';
import apiRoutes from './routes/api.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';
import path from 'path';

const app = express();
const port = 5050;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

const specPath = path.resolve('./openapi.yaml');

app.get('/docs/swagger.json', (_req, res) => {
  const file = fs.readFileSync(specPath, 'utf8');
  const swaggerDocument = yaml.parse(file);
  res.json(swaggerDocument);
});

const swaggerOptions = {
  swaggerOptions: {
    url: '/docs/swagger.json',
  },
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

app.use('/api', apiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

async function startServer() {
  try {
    await initKeycloak();
    await sequelize.authenticate();
    console.log('Database connection established');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
    } else {
      await sequelize.sync();
    }

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server: ', err);
    process.exit(1);
  }
}

startServer();
