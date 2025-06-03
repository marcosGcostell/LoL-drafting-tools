import Lolalytics from '../models/api/lolalytics-api.js';
import Counter from '../models/counter-model.js';
import { getListFromDb } from './common-list-handlers.js';

const saveCounterList = async (champion, lane, rank, vslane, list) => {
  try {
    const data = {
      champion,
      lane,
      rank,
      vslane,
      createdAt: new Date().toISOString(),
      list,
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
    // 1) sorting functionality
    let counterList;
    const queryObj = {
      champion: req.champion,
      lane: req.lane,
      rank: req.rank,
      vslane: req.vslane,
    };
    console.log(queryObj);
    const data = await getListFromDb(Counter, queryObj);

    if (!data) {
      counterList = await Lolalytics.getCounters(
        req.champion,
        req.lane,
        req.rank,
        req.vslane
      );
      saveCounterList(
        req.champion,
        req.lane,
        req.rank,
        req.vslane,
        counterList
      );
    } else {
      counterList = data.list;
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
