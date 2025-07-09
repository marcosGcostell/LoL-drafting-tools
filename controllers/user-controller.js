import User from '../models/user-model.js';
import { RiotRole, RiotRank } from '../models/riot-static-model.js';
import Champion from '../models/riot-champion-model.js';
import catchAsync from '../models/utils/catch-async.js';
import AppError from '../models/utils/app-error.js';
import { RESERVED_USER_NAMES } from '../models/utils/config.js';

const _isValidUserName = userName => {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;

  if (!usernameRegex.test(userName)) {
    return {
      valid: false,
      message:
        'User name should start with a letter and use only letters, numbers or underscore(_)',
    };
  }

  if (RESERVED_USER_NAMES.includes(userName.toLowerCase())) {
    return {
      valid: false,
      message: 'This user name is reserved',
    };
  }

  return { valid: true };
};

const _isValidRole = async role => {
  const validRole = await RiotRole.isValid(role);
  if (!validRole) {
    throw new AppError(`Invalid role: '${role}'`, 400);
  }
  return validRole;
};

const _isValidRank = async rank => {
  const validRank = await RiotRank.isValid(rank);
  if (!validRank) {
    throw new AppError(`Invalid rank: '${rank}'`, 400);
  }
  return validRank;
};

export const validateUserName = catchAsync(async (req, res, next) => {
  const { userName } = req.body;
  // Continue to validate other fields if no data
  if (!userName) return next();

  const result = _isValidUserName(userName);

  if (!result.valid) {
    return next(new AppError(result.message, 400));
  }

  next();
});

export const validateUserData = catchAsync(async (req, res, next) => {
  const { data } = req.body;
  // Continue to update other fields if no data
  if (!data) return next();

  if (data?.primaryRole) await _isValidRole(data.primaryRole);
  if (data?.secondaryRole) await _isValidRole(data.secondaryRole);

  if (data?.primaryRank) await _isValidRank(data.primaryRank);

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

export const userExists = catchAsync(async (req, res, next) => {
  const { userName, email } = req.body;

  if (!userName && !email) {
    return next(new AppError('Field can not be empty', 400));
  }
  if (email && !User.isValidEmail(email)) {
    return next(new AppError('Please provide a valid email', 400));
  }

  const user = await User.findOne({
    $or: [{ email }, { userNameToLower: userName?.toLowerCase() }],
  });

  const checkedField = userName ? 'userName' : 'email';
  if (user) {
    return next(
      new AppError(`User with this ${checkedField} already exists`, 400)
    );
  }

  res.status(200).json({
    status: 'success',
    isValid: true,
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  // Execute the query
  const users = await User.find();

  // Send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const createUser = catchAsync(async (req, res, next) => {});

export const getUser = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = req.user;

  ['name', 'userName', 'email'].forEach(field => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  if (req.body.config) {
    Object.entries(req.body.config).forEach(([key, value]) => {
      if (value !== undefined) {
        user.config[key] = value;
      }
    });
  }

  if (req.body.data && typeof req.body.data === 'object') {
    Object.entries(req.body.data).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue !== undefined) {
            user.data[key][nestedKey] = nestedValue;
          }
        });
      } else {
        if (value !== undefined) {
          user.data[key] = value;
        }
      }
    });
  }

  if (req.body.password) {
    if (!req.body.passwordConfirm) {
      return next(new AppError('Please confirm your new password', 400));
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
  }

  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {});
