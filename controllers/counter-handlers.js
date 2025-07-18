import Lolalytics from '../models/api/lolalytics-api.js';
import Counter from '../models/counter-model.js';
import { getAllRoleRates, getAllTierlist } from './tierlist-handlers.js';
import { getListFromDb } from './common-list-handlers.js';
import { DEFAULT_SORT_FIELD } from '../models/utils/config.js';
import { isoTimeStamp } from '../models/utils/helpers.js';
import catchAsync from '../models/utils/catch-async.js';

const saveCounterList = async (queryObj, list) => {
  const data = {
    ...queryObj,
    createdAt: isoTimeStamp(),
    list,
  };

  await Counter.create(data);
  console.log(
    `✅ Counter list saved: (${queryObj.champion}, ${queryObj.lane}, ${queryObj.rank}, ${queryObj.vslane}, ${queryObj.patch})`,
  );
  return data;
};

const getCounterListData = async queryObj => {
  console.log(queryObj);
  const data = await getListFromDb(Counter, queryObj);

  if (data) {
    console.log('Getting Counters from database...');
    return { counterList: data.list, createdAt: data.createdAt };
  }
  console.log('Getting Counters from website...');
  const counterList = await Lolalytics.getCounters(queryObj);
  const allTierlists = await getAllTierlist(queryObj.rank, queryObj.patch);

  const completeList = counterList.map(el => {
    const [champion] = allTierlists[queryObj.vslane].filter(
      item => el.name === item.name,
    );
    return {
      name: el.name,
      winRatio: el.winRatio,
      opponentWR: champion?.winRatio || 0,
      opponentLane: queryObj.vslane,
      delta1: el.delta1,
      delta2: el.delta2,
      roleRates: getAllRoleRates(el.name, allTierlists),
      pickRate: champion?.pickRate || 0,
      banRate: champion?.banRate || 0,
    };
  });

  saveCounterList(queryObj, completeList);
  return { counterList: completeList, createdAt: isoTimeStamp() };
};

// getCounterList function to get a counter list from database or website
export default catchAsync(async (req, res, next) => {
  const queryObj = {
    champion: req.champion,
    lane: req.lane,
    rank: req.rank,
    vslane: req.vslane,
    patch: req.patch,
  };
  const { counterList, createdAt } = await getCounterListData(queryObj);

  const sort = req.query.sort || DEFAULT_SORT_FIELD;
  counterList.sort((a, b) => b[sort] - a[sort]);
  delete queryObj.champion;

  // Send response
  res.status(200).json({
    status: 'success',
    results: counterList.length,
    createdAt,
    data: {
      id: req.champion,
      ...queryObj,
      counterList,
    },
  });
});
