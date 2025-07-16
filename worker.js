import dotenv from 'dotenv';
import updateAllTierlists from './models/utils/scheduler.js';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

(async () => {
  const options = process.argv.slice(2).reduce((acc, el) => {
    acc[el.slice(2)] = true;
    return acc;
  }, {});
  updateAllTierlists(DB, options);
})();
