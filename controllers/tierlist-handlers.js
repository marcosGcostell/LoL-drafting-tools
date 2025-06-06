import Lolalytics from '../models/api/lolalytics-api.js';
import Tierlist from '../models/tierlist-model.js';
import { getListFromDb } from './common-list-handlers.js';

const saveTierlist = (lane, rank, list) => {
  try {
    const data = {
      rank,
      lane,
      createdAt: new Date().toISOString(),
      list,
    };

    Tierlist.create(data);
    console.log('Tierlist saved! ✅');
  } catch (err) {
    throw err;
  }
};

export const getTierlistData = async (lane, rank) => {
  try {
    console.log({ lane, rank });
    const data = await getListFromDb(Tierlist, { lane, rank });

    if (data) {
      return { tierlist: data.list, updatedAt: data.createdAt };
    }

    const tierlist = await Lolalytics.getTierlist(lane, rank);
    saveTierlist(lane, rank, tierlist);
    return { tierlist, updatedAt: new Date().toISOString() };
  } catch (err) {
    throw err;
  }
};

export const getTierlist = async (req, res) => {
  try {
    const { tierlist, updatedAt } = await getTierlistData(req.lane, req.rank);

    // Send response
    res.status(200).json({
      status: 'success',
      results: tierlist.length,
      updatedAt,
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
