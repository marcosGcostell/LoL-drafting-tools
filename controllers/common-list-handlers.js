import qs from 'qs';

import { riotRole, riotRank } from '../models/riot-static-model.js';
import Champion from '../models/riot-champion-model.js';
import { hasLocalVersionExpired } from '../models/common/helpers.js';

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
    console.log('Getting counter list from database...');
    const lists = await Model.find(queryObj);
    if (!lists.length) return null;

    // Delete expired lists. Using map to return promises and await them
    // With forEach the function keeps going even awaiting findById inside
    const numberOfLists = lists.length;
    const expiredLists = lists.filter(list =>
      hasLocalVersionExpired(list.createdAt)
    );
    await Promise.all(
      expiredLists.map(list => Counter.findByIdAndDelete(list._id))
    );
    if (!(numberOfLists - expiredLists.length)) return null;

    // Select one after deleting expired ones
    let query = Model.findOne(queryObj);
    query = query.select('-__v -_id -list._id');
    const list = await query;

    // Return the list if there is any previous document
    return !Object.is(list, {}) ? list : null;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
