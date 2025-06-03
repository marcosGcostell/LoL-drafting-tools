import Lolalytics from '../models/api/lolalytics-api.js';
import Tierlist from '../models/tierlist-model.js';
import { getListFromDb } from './common-list-handlers.js';

const saveTierlist = async (lane, rank, list) => {
  try {
    const data = {
      rank,
      lane,
      createdAt: new Date().toISOString(),
      list,
    };

    await Tierlist.create(data);
    console.log('Tierlist saved! ✅');
    return data;
  } catch (err) {
    throw err;
  }
};

export const getTierlist = async (req, res) => {
  try {
    let tierlist;
    const queryObj = {
      lane: req.lane,
      rank: req.rank,
    };
    console.log(queryObj);
    const data = await getListFromDb(Tierlist, queryObj);

    if (!data) {
      tierlist = await Lolalytics.getTierlist(req.lane, req.rank);
      saveTierlist(req.lane, req.rank, tierlist);
    } else {
      tierlist = data.list;
    }

    // Send response
    res.status(200).json({
      status: 'success',
      results: tierlist.length,
      data: {
        tierlist,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
