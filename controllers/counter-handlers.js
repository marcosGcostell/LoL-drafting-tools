import qs from 'qs';

import Lolalytics from '../models/api/lolalytics-api.js';
import Counter from '../models/counter-model.js';
import { hasLocalVersionExpired } from '../models/common/helpers.js';

const getCounterListFromDb = async queryObj => {
  try {
    console.log('Getting counter list from database...');
    if (!queryObj?.rank) queryObj.rank = 'all';
    if (!queryObj?.vslane) queryObj.vslane = queryObj.lane;

    // Select the stored counter list that matches the query
    const counterLists = await Counter.find(queryObj);
    if (!counterLists.length) return null;

    // Delete expired counter lists. Using map to return promises and await them
    // With forEach the function keeps going even awaiting findById inside
    const numberOfCounterLists = counterLists.length;
    const expiredCounterLists = counterLists.filter(counterList =>
      hasLocalVersionExpired(counterList.createdAt)
    );
    await Promise.all(
      expiredCounterLists.map(counterList =>
        Counter.findByIdAndDelete(counterList._id)
      )
    );
    if (!(numberOfCounterLists - expiredCounterLists.length)) return null;

    // Select one after deleting expired ones
    let query = Counter.findOne(queryObj);
    query = query.select('-__v -_id -counterList._id');
    const counterList = await query;

    // Return the counter list if there is any previous document
    return !Object.is(counterList, {}) ? counterList : null;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

const saveCounterList = async (champion, lane, rank, vslane, counterList) => {
  try {
    const data = {
      champion,
      lane,
      rank,
      vslane,
      createdAt: new Date().toISOString(),
      counterList,
    };

    await Counter.create(data);
    console.log('Counter list saved! ✅');
    return data;
  } catch (err) {
    throw err;
  }
};

export const getCounterList = async (req, res) => {
  try {
    // TODO
    // 1) check the query should happen here at the latest
    // 2) sorting functionality

    let counterList;
    const queryObj = { ...qs.parse(req.query) };
    const data = await getCounterListFromDb(queryObj);

    if (!data) {
      const { champion, lane, rank, vslane } = queryObj;
      counterList = await Lolalytics.getCounters(champion, lane, rank, vslane);
      saveCounterList(champion, lane, rank, vslane, counterList);
    } else {
      counterList = data.counterList;
    }

    // Send response
    res.status(200).json({
      status: 'success',
      results: counterList.length,
      data: {
        counterList,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
