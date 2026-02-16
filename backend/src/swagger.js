import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '0.0.1',
      description: 'Backend API documentation',
    },
    servers: [
      {
        url: 'http://localhost:5050',
        description: 'Local development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: {
              type: 'string',
              enum: ['admin', 'developer', 'clinician'],
            },
            timezone: { type: 'string' },
            lastSyncedAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
