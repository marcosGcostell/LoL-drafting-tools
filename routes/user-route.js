import express from 'express';

import * as userController from '../controllers/user-controller.js';
import * as authController from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/signup', userController.validateUserName, authController.signup);
router.post('/login', authController.login);
router.post(
  '/check',
  userController.validateUserName,
  userController.userExists,
);

router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/me')
  .get(authController.protect, userController.getUser)
  .patch(
    authController.protect,
    userController.validateUserName,
    userController.validateUserData,
    userController.updateUser,
  )
  .delete(authController.protect, userController.deleteUser);

export default router;
