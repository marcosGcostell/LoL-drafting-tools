import User from '../models/user-model.js';
import { RiotRole, RiotRank } from '../models/riot-static-model.js';
import Champion from '../models/riot-champion-model.js';
import catchAsync from '../models/utils/catch-async.js';
import AppError from '../models/utils/app-error.js';
import { RESERVED_USER_NAMES } from '../models/utils/config.js';

const _isValidUserName = username => {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;

  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message:
        'User name should start with a letter and use only letters, numbers or underscore(_)',
    };
  }

  if (RESERVED_USER_NAMES.includes(username.toLowerCase())) {
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

const _filterFields = (obj, allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

const _flattenFields = (obj, prefix = '') =>
  Object.keys(obj).reduce((acc, key) => {
    const path = prefix.length ? `${prefix}.` : '';
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(acc, _flattenFields(obj[key], `${path}${key}`));
    } else {
      acc[`${path}${key}`] = obj[key];
    }
    return acc;
  }, {});

export const validateUserName = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  // Continue to validate other fields if no data
  if (!username) return next();

  const result = _isValidUserName(username);

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
    Object.entries(data.championPool).forEach(lane => {
      const [role, champions] = lane;
      if (!Array.isArray(champions)) {
        return next(
          new AppError(
            `Champion pool for role '${role}' must be an array`,
            400,
          ),
        );
      }
    });

    const flatPool = Object.entries(data.championPool).flatMap(
      ([role, champions]) => champions.map(champId => ({ role, champId })),
    );

    const validations = await Promise.all(
      flatPool.map(({ champId }) => Champion.isValid(champId)),
    );
    const errorIndex = validations.findIndex(i => !i);

    if (errorIndex !== -1) {
      const { role, champId } = flatPool[errorIndex];
      return next(
        new AppError(`Invalid champion ID '${champId}' in role '${role}'`, 400),
      );
    }
  }

  next();
});

export const userExists = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;

  if (!username && !email) {
    return next(new AppError('Field can not be empty', 400));
  }
  if (email && !User.isValidEmail(email)) {
    return next(new AppError('Please provide a valid email', 400));
  }

  const user = await User.findOne({
    $or: [{ email }, { usernameToLower: username?.toLowerCase() }],
  });

  const checkedField = username ? 'username' : 'email';
  if (user) {
    return next(
      new AppError(`User with this ${checkedField} already exists`, 400),
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
  const { user } = req;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const allowedFields = ['name', 'username', 'email', 'data', 'config'];
  const filteredBody = _filterFields(req.body, allowedFields);
  const flattenBody = _flattenFields(filteredBody);

  // Nested fields shoud be flattened and use $set operator
  // in order to not loose all the missing data
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: flattenBody },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {});
