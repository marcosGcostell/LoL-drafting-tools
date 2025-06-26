import dotenv from 'dotenv';
import { updateAllTierlists } from './models/utils/scheduler.js';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

(async () => {
  updateAllTierlists(DB);
})();
