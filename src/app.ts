import express from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';

import swaggerDocs from './swagger.json';
import { router } from './routes/index';

export const app = express();

// Middleware config
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(logger('dev'));

// ENDPOINT INTEGRATION
app.use('/api/v1', router);

// Root path response
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

export default app;
