import express from 'express';

import * as tierlistHandlers from '../controllers/tierlist-handlers.js';

const router = express.Router();

router.route('/').get(tierlistHandlers.getTierlist);

export default router;
