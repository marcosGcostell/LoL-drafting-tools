import express from 'express';

import * as appDataHandlers from '../controllers/app-data-handlers.js';

const router = express.Router();

router
  .route('/')
  .get(
    appDataHandlers.checkGameVersion,
    appDataHandlers.updateDatabase,
    appDataHandlers.getChampions,
  );

router
  .route('/version')
  .get(appDataHandlers.checkGameVersion, appDataHandlers.getVersion);

// router.route('/:id').get(appDataHandlers.getChampionById);

export default router;
