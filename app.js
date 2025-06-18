import express from 'express';
import cors from 'cors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import morgan from 'morgan';

import appDataRouter from './routes/app-data-routes.js';
import tierlistRouter from './routes/tierlist-routes.js';
import counterRouter from './routes/counter-routes.js';
import statsRouter from './routes/stats-route.js';

// 0) Reset the static riot data from hard coded
// import resetStaticData from './models/riot-static-reset-data.js';
// resetStaticData();

dotenv.config({ path: './config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(cors());
} else {
  // app.use(cors({
  //   origin: 'https://apiurl.com';
  // }))
}
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/app-data', appDataRouter);
app.use('/api/v1/tierlist', tierlistRouter);
app.use('/api/v1/counters', counterRouter);
app.use('/api/v1/stats', statsRouter);

export default app;
