import User from '../models/user-model.js';
import catchAsync from '../models/utils/catch-async.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  // Execute the query
  const user = await User.find();

  // Send response
  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    },
  });
});

export const createUser = catchAsync((req, res, next) => {});
export const getUser = catchAsync((req, res, next) => {});
export const updateUser = catchAsync((req, res, next) => {});
export const deleteUser = catchAsync((req, res, next) => {});
