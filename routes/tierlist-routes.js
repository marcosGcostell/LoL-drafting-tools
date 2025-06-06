import express from 'express';

import * as ListHandlers from '../controllers/common-list-handlers.js';
import * as tierlistHandlers from '../controllers/tierlist-handlers.js';

const router = express.Router();

router.route('/').get(ListHandlers.filterQuery, tierlistHandlers.getTierlist);

export default router;
