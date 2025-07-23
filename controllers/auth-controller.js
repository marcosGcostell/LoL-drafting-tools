import jwt from 'jsonwebtoken';

import User from '../models/user-model.js';
import catchAsync from '../models/utils/catch-async.js';
import AppError from '../models/utils/app-error.js';
import { dateNowToISO } from '../models/utils/helpers.js';

const _signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const _verifyToken = token =>
  new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return rej(err);
      }
      res(decoded);
    });
  });

const _loginUser = (res, user, status) => {
  const token = _signToken(user._id);
  delete user.password;

  res.status(status).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const data = req.body;
  const newUser = await User.create({
    name: data.name,
    username: data.username,
    email: data.email,
    avatar: data.avatar,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
    passwordChangedAt: dateNowToISO(),
    createdAt: dateNowToISO(),
  });

  _loginUser(res, newUser, 201);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, username, password } = req.body;

  if (!(email || username) || !password) {
    return next(
      new AppError('Please provide email or user name and Password!', 400),
    );
  }

  const user = await User.findOne({
    $or: [{ email }, { usernameToLower: username?.toLowerCase() }],
  }).select('+password');
  console.log(user);
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  _loginUser(res, user, 200);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  const decoded = await _verifyToken(token);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401),
    );
  }

  if (currentUser.hasChangedPassword(decoded.iat)) {
    return next(
      new AppError('User recently changed password!. Please log in again', 401),
    );
  }

  // Grant ACCESS to the protected route
  req.user = currentUser;
  next();
});

export const protectInternal = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(new AppError('Forbidden', 403));
  }

  const token = req.headers.authorization.split(' ')[1];
  if (token !== process.env.WORKER_SECRET) {
    return next(new AppError('Forbidden', 403));
  }
  next();
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, password, passwordConfirm } = req.body;
  if (!oldPassword || !password || !passwordConfirm) {
    return next(
      new AppError(
        'Current password, new password and new password confirmed are required to change the password.',
        400,
      ),
    );
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.checkPassword(oldPassword, user.password))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  _loginUser(res, user, 200);
});
