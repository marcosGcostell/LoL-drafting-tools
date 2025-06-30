import jwt from 'jsonwebtoken';

import User from '../models/user-model.js';
import catchAsync from '../models/utils/catch-async.js';
import AppError from '../models/utils/app-error.js';
import { isoTimeStamp } from '../models/utils/helpers.js';

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

export const signup = catchAsync(async (req, res, next) => {
  const data = req.body;
  const newUser = await User.create({
    name: data.name,
    userName: data.userName,
    email: data.email,
    avatar: data.avatar,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
    passwordChangedAt: isoTimeStamp(),
    createdAt: isoTimeStamp(),
  });

  const token = _signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, userName, password } = req.body;

  if (!(email || userName) || !password) {
    return next(
      new AppError('Please provide email or user name and Password!', 400)
    );
  }

  const user = await User.findOne({
    $or: [{ email }, { userNameToLower: userName?.toLowerCase() }],
  }).select('+password');
  console.log(user);
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  const token = _signToken(user._id);
  console.log(token);
  res.status(200).json({
    status: 'success',
    token,
  });
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
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await _verifyToken(token);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  if (currentUser.hasChangedPassword(decoded.iat)) {
    return next(
      new AppError('User recently changed password!. Please log in again', 401)
    );
  }

  // Grant ACCESS to the protected route
  req.user = currentUser;
  next();
});
