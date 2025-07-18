import mongoose from 'mongoose';
import app from './app.js';
import tierlistCache from './models/tierlist-cache.js';
import riotDataCache from './models/riot-data-cache.js';

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');
    tierlistCache.loadAllFromDB();
    riotDataCache.loadAllFromDB();
  })
  .then(() => console.log('Main data loaded in cache.'));

const port = process.env.NODE_ENV === 'production' ? 3000 : process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
