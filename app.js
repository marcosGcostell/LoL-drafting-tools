import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import morgan from 'morgan';

import appDataRouter from './routes/app-data-routes.js';
import tierlistRouter from './routes/tierlist-routes.js';
import counterRouter from './routes/counter-routes.js';

dotenv.config({ path: './config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/v1/app-data', appDataRouter);
app.use('/api/v1/tierlist', tierlistRouter);
// app.use('/api/v1/counters', counterRouter);

export default app;
