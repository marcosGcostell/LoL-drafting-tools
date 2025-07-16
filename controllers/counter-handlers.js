import Lolalytics from '../models/api/lolalytics-api.js';
import Counter from '../models/counter-model.js';
import { getAllRoleRates, getAllTierlist } from './tierlist-handlers.js';
import { getListFromDb } from './common-list-handlers.js';
import { DEFAULT_SORT_FIELD } from '../models/utils/config.js';
import { isoTimeStamp } from '../models/utils/helpers.js';
import catchAsync from '../models/utils/catch-async.js';

const saveCounterList = async (champion, lane, rank, vslane, patch, list) => {
  const data = {
    champion,
    lane,
    rank,
    vslane,
    patch,
    createdAt: isoTimeStamp(),
    list,
  };

  await Counter.create(data);
  console.log(
    `✅ Counter list saved: (${champion}, ${lane}, ${rank}, ${vslane}, ${patch})`,
  );
  return data;
};

const getCounterListData = async (champion, lane, rank, vslane, patch) => {
  console.log({ champion, lane, rank, vslane, patch });
  const data = await getListFromDb(Counter, {
    champion,
    lane,
    rank,
    vslane,
    patch,
  });

  if (data) {
    console.log('Getting Counters from database...');
    return { counterList: data.list, updatedAt: data.createdAt };
  }
  console.log('Getting Counters from website...');
  const counterList = await Lolalytics.getCounters(
    champion,
    lane,
    rank,
    vslane,
    patch,
  );
  saveCounterList(champion, lane, rank, vslane, patch, counterList);
  return { counterList, updatedAt: isoTimeStamp() };
};

// getCounterList function to get a counter list from database or website
export default catchAsync(async (req, res, next) => {
  const { counterList, updatedAt } = await getCounterListData(
    req.champion,
    req.lane,
    req.rank,
    req.vslane,
    req.patch,
  );
  const allTierlists = await getAllTierlist(req.rank, req.patch);

  const completeList = counterList.map(el => {
    const [champion] = allTierlists[req.vslane].filter(
      item => el.name === item.name,
    );
    return {
      name: el.name,
      winRatio: el.winRatio,
      opponentWR: champion?.winRatio || 0,
      opponentLane: req.vslane,
      delta1: el.delta1,
      delta2: el.delta2,
      roleRates: getAllRoleRates(el.name, allTierlists),
      pickRate: champion?.pickRate || 0,
      banRate: champion?.banRate || 0,
    };
  });

  const sort = req.query.sort || DEFAULT_SORT_FIELD;
  completeList.sort((a, b) => b[sort] - a[sort]);

  // Send response
  res.status(200).json({
    status: 'success',
    results: completeList.length,
    updatedAt,
    data: {
      id: req.champion,
      lane: req.lane,
      rank: req.rank,
      vslane: req.vslane,
      patch: req.patch,
      counterList: completeList,
    },
  });
});
