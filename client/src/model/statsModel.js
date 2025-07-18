import AppError from './appError.js';
import ChampionList from './championListModel.js';
import { fetchListFromAPI } from '../services/apiCalls.js';
import { COUNTERS_ROUTE } from '../utils/config.js';

const getCounterList = async (champion, { lane, rank, vslane, patch }) => {
  if (!champion.id) throw new Error("Can't get data without a champion id");

  // API works for lolalytics folders for champion names
  const route = `${COUNTERS_ROUTE}/${champion.id}`;
  const query = { lane, rank, vslane, patch, sortedBy: 'pickRate' };

  const { counterList } = await fetchListFromAPI(route, query);

  const newList = new ChampionList(counterList);
  newList.completeListData();
  return newList.data;
};

const calcScore = (winRatio, counter) => {
  let score = Math.round(
    5 +
      (counter.winRatio - 50) * 0.45 +
      (counter.winRatio - winRatio) * 0.1 +
      counter.delta1 * 0.13 +
      (winRatio - counter.opponentWR) * 0.07 +
      counter.delta2 * 0.25,
  );
  score = score > 9 ? 9 : score;
  score = score < 0 ? 0 : score;
  return score;
};

// getStatsList function to fetch data from API
export default async (champion, { lane, rank, vslane, patch, tierlist }) => {
  if (!tierlist) {
    throw new AppError('Need a tierlist to get the stats.', {
      origin: 'model',
      type: 'stats',
    });
  }
  const counterList = await getCounterList(champion, {
    lane,
    rank,
    vslane,
    patch,
  });

  return tierlist.map(opponent => {
    const [match] = counterList.filter(el => el.id === opponent.id);
    if (match) {
      match.score = calcScore(champion.winRatio, match);
      match.index = opponent.index;
    }
    return match || { score: 0, winRatio: 0, delta2: 0 };
  });
};
