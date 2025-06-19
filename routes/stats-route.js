import express from 'express';

import * as ListHandlers from '../controllers/common-list-handlers.js';
import * as StatsHandlers from '../controllers/stats-handlers.js';

const router = express.Router();

router.param('id', ListHandlers.checkId);

router
  .route('/:id')
  .get(ListHandlers.filterQuery, StatsHandlers.getChampionStats);

export default router;
