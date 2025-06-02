import express from 'express';

import * as counterHandlers from '../controllers/counter-handlers.js';

const router = express.Router();

// router.param('id', counterHandlers.checkID);

// router
//   .route('/:id')
//   .get(counterHandlers.getCounterList)

router.route('/').get(counterHandlers.getCounterList);

export default router;
