import User from '../models/user-model.js';
import { RiotRole } from '../models/riot-static-model.js';
import Champion from '../models/riot-champion-model.js';
import catchAsync from '../models/utils/catch-async.js';
import AppError from '../models/utils/app-error.js';

const _isValidUsername = username => {
  const reservedUsernames = [
    'login',
    'signup',
    'logout',
    'admin',
    'me',
    'user',
    'users',
  ];

  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;

  const lowerUsername = username.toLowerCase();

  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message:
        'Formato inválido: debe empezar por una letra y solo usar letras, números o _',
    };
  }

  if (reservedUsernames.includes(lowerUsername)) {
    return {
      valid: false,
      message: 'Nombre de usuario reservado',
    };
  }

  return { valid: true };
};

export const validateUsername = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  const result = _isValidUsername(username);

  if (!result.valid) {
    return next(new AppError(result.message, 400));
  }

  next();
});

export const validateUserData = catchAsync(async (req, res, next) => {
  const { data } = req.body;
  // Continue to update other fields if no data
  if (!data) next();

  if (data?.primaryRole) {
    const validRole = await RiotRole.isValid(data.primaryRole);
    if (!validRole) {
      return next(new AppError(`Invalid role: '${data.primaryRole}'`, 400));
    }
  }

  if (data?.primaryRank) {
    const validRank = await RiotRole.isValid(data.primaryRank);
    if (!validRank) {
      return next(new AppError(`Invalid rank: '${data.primaryRank}'`, 400));
    }
  }

  if (data?.championPool && typeof data.championPool === 'object') {
    for (const [role, champions] of Object.entries(data.championPool)) {
      if (!Array.isArray(champions)) {
        return next(
          new AppError(`Champion pool for role '${role}' must be an array`, 400)
        );
      }

      for (const champId of champions) {
        const validChamp = await Champion.isValid(champId);
        if (!validChamp) {
          return next(
            new AppError(
              `Invalid champion ID '${champId}' in role '${role}'`,
              400
            )
          );
        }
      }
    }
  }

  next();
});

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
