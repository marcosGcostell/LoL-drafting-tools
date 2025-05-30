import express from 'express';

import * as appDataHandlers from '../controllers/app-data-handlers.js';

const router = express.Router();

// router.route('/versions').get(appDataHandlers.getVersion);

router.route('/').get(appDataHandlers.getChampions);

// router.route('/:id').get(appDataHandlers.getChampionById);

export default router;
