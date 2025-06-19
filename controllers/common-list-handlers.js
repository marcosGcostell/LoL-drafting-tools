import qs from 'qs';

import { riotRole, riotRank } from '../models/riot-static-model.js';
import Champion from '../models/riot-champion-model.js';
import { expirationDate } from '../models/common/helpers.js';
import catchAsync from '../models/common/catch-async.js';
import catchAsyncParam from '../models/common/catch-async-param.js';
import AppError from '../models/common/app-error.js';

export const checkId = catchAsyncParam(async (req, res, next, val) => {
  const champion = await Champion.findOne({
    $or: [{ riotID: val }, { id: val }, { name: val }],
  });
  if (!champion) {
    next(new AppError('Champion name not found', 404));
  }
  // Use lolalytics id name
  req.champion = champion.id;
  console.log(req.champion);
  next();
});

export const filterQuery = catchAsync(async (req, res, next) => {
  const queryObj = { ...qs.parse(req.query) };
  const { lane, rank, vslane } = queryObj;

  const checkedLane = await riotRole.findOne({
    $or: [{ id: lane }, { name: lane }],
  });
  const checkedVsLane = await riotRole.findOne({
    $or: [{ id: vslane }, { name: vslane }],
  });
  const checkedRank = await riotRank.findOne({
    $or: [{ id: rank }, { name: rank }],
  });

  // TODO Default lane should be most used lane in that champion
  req.lane = checkedLane ? checkedLane.id : 'top';
  req.vslane = checkedVsLane ? checkedVsLane.id : req.lane;
  req.rank = checkedRank ? checkedRank.id : 'all';
  next();
});

export const getListFromDb = async (Model, queryObj) => {
  const lists = await Model.deleteMany({
    createdAt: { $lte: expirationDate() },
  });

  const list = await Model.findOne(queryObj);
  // If no list found return null
  return list;
};
