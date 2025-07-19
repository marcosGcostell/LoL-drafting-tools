import express from 'express';

import updateTierlists from '../controllers/refresh-cache-service.js';
import * as authController from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/refresh-cache', authController.protectInternal, updateTierlists);

export default router;
