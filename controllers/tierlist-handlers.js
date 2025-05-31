import qs from 'qs';

import Lolalytics from '../models/api/lolalytics-api.js';
import Tierlist from '../models/tierlist-model.js';
import { hasLocalVersionExpired } from '../models/common/helpers.js';

const getTierlistFromDb = async queryObj => {
  try {
    console.log('Getting tierlist from database...');

    // Select the tierlists saved that matches the query
    const tierlists = await Tierlist.find(queryObj);
    console.log('DB tierlists: ', tierlists);

    // If there is no one, exit
    if (!tierlists.length) return null;

    // Delete the expired tierlists
    tierlists.forEach(async tierlist => {
      console.log(hasLocalVersionExpired(tierlist.createdAt));
      if (hasLocalVersionExpired(tierlist.createdAt)) {
        console.log(tierlist._id);
        // Tierlist.deleteOne({ createdAt: tierlist.createdAt });
        await Tierlist.findByIdAndDelete(tierlist._id);
      }
    });

    // Select one after deleting expired ones
    let query = Tierlist.findOne(queryObj);
    query = query.select('-__v -_id');
    const tierlist = await query;

    // Return the tierlist if there is any previous document
    return !Object.is(tierlist, {}) ? tierlist : null;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

const saveTierlist = async (rank, lane, tierlist) => {
  try {
    const data = {
      rank,
      lane,
      createdAt: new Date().toISOString(),
      tierlist,
    };

    // BUG Don't save if there is a doc
    await Tierlist.create(data);
    console.log('Tierlist saved! ✅');
    return data;
  } catch (err) {
    throw err;
  }
};

export const getTierlist = async (req, res) => {
  try {
    // TODO
    // 1) get the data from lolalytics
    // 2) save the query as cached in database
    // 3) check before if there is a cached version in database
    // 4) sorting functionality

    let tierlist;
    const queryObj = { ...qs.parse(req.query) };
    const data = await getTierlistFromDb(queryObj);

    if (!data) {
      const { rank, lane } = queryObj;
      tierlist = await Lolalytics.getTierlist(rank, lane);
      saveTierlist(rank, lane, tierlist);
    } else {
      tierlist = data.tierlist;
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
