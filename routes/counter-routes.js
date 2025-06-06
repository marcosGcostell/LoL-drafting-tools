import express from 'express';

import * as ListHandlers from '../controllers/common-list-handlers.js';
import * as counterHandlers from '../controllers/counter-handlers.js';

const router = express.Router();

router.param('id', ListHandlers.checkId);

router
  .route('/:id')
  .get(ListHandlers.filterQuery, counterHandlers.getCounterList);

export default router;
