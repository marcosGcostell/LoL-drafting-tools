import qs from 'qs';

import { riotRole, riotRank } from '../models/riot-static-model.js';
import Champion from '../models/riot-champion-model.js';
import { expirationDate } from '../models/common/helpers.js';

export const checkId = async (req, res, next, val) => {
  try {
    const champion = await Champion.findOne({
      $or: [{ riotID: val }, { id: val }, { name: val }],
    });
    if (!champion) {
      return res.status(404).json({
        status: 'fail',
        message: 'Champion name not found',
      });
    }
    // Use lolalytics id name
    req.champion = champion.id;
    console.log(req.champion);
    next();
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const filterQuery = async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getListFromDb = async (Model, queryObj) => {
  try {
    console.log('Getting list from database...');
    const lists = await Model.deleteMany({
      createdAt: { $lte: expirationDate() },
    });

    const list = await Model.findOne(queryObj);
    // If no list found return null
    return list;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
