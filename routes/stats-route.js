import express from 'express';

import * as ListHandlers from '../controllers/common-list-handlers.js';
import getChampionStats from '../controllers/stats-handlers.js';

const router = express.Router();

router.param('id', ListHandlers.checkId);

router.route('/:id').get(ListHandlers.filterQuery, getChampionStats);

export default router;
