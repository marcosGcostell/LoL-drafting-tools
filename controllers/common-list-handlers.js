import qs from 'qs';

import { RiotRole, RiotRank } from '../models/riot-static-model.js';
import Champion from '../models/riot-champion-model.js';
import Version from '../models/riot-version-model.js';
import { expirationDate } from '../models/utils/helpers.js';
import catchAsync from '../models/utils/catch-async.js';
import catchAsyncParam from '../models/utils/catch-async-param.js';
import AppError from '../models/utils/app-error.js';

export const checkId = catchAsyncParam(async (req, res, next, val) => {
  const champion = await Champion.isValid(val);
  if (!champion) {
    next(new AppError('Champion name not found', 404));
  }
  // Use lolalytics id name
  req.champion = champion.id;
  next();
});

export const filterQuery = catchAsync(async (req, res, next) => {
  const queryObj = { ...qs.parse(req.query) };
  const { lane, rank, vslane, patch } = queryObj;

  const checkedLane = await RiotRole.isValid(lane);
  const checkedVsLane = await RiotRole.isValid(vslane);
  const checkedRank = await RiotRank.isValid(rank);

  req.lane = checkedLane?.id || 'top';
  req.vslane = checkedVsLane?.id || req.lane;
  req.rank = checkedRank?.id || 'all';
  req.patch = patch || (await Version.getVersionString());
  next();
});

export const getListFromDb = async (Model, queryObj) => {
  await Model.deleteMany({ createdAt: { $lte: expirationDate() } });

  const list = await Model.findOne(queryObj);
  // If no list found return null
  return list;
};
