import Lolalytics from '../models/api/lolalytics-api.js';
import Counter from '../models/counter-model.js';
import { getTierlistData } from './tierlist-handlers.js';
import { getListFromDb } from './common-list-handlers.js';
import { DEFAULT_SORT } from '../models/common/config.js';

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

const getCounterListData = async (champion, lane, rank, vslane) => {
  try {
    console.log({ champion, lane, rank, vslane });
    const data = await getListFromDb(Counter, { champion, lane, rank, vslane });

    if (data) {
      return { counterList: data.list, updatedAt: data.createdAt };
    }
    const counterList = await Lolalytics.getCounters(
      champion,
      lane,
      rank,
      vslane
    );
    saveCounterList(champion, lane, rank, vslane, counterList);
    return { counterList, updatedAt: new Date().toISOString() };
  } catch (err) {
    throw err;
  }
};

export const getCounterList = async (req, res) => {
  try {
    const { counterList, updatedAt } = await getCounterListData(
      req.champion,
      req.lane,
      req.rank,
      req.vslane
    );
    const { tierlist } = await getTierlistData(req.vslane, req.rank);

    const completeList = counterList.map(el => {
      const [champion] = tierlist.filter(item => el.name === item.name);
      return {
        name: el.name,
        winRatio: el.winRatio,
        opponentWR: champion?.winRatio || 0,
        delta1: el.delta1,
        delta2: el.delta2,
        pickRate: champion?.pickRate || 0,
        banRate: champion?.banRate || 0,
      };
    });

    const sort = req.query.sort || DEFAULT_SORT;
    completeList.sort((a, b) => b[sort] - a[sort]);

    // Send response
    res.status(200).json({
      status: 'success',
      results: completeList.length,
      updatedAt,
      data: {
        counterList: completeList,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
