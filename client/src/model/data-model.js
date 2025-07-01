import {
  LOCAL_API,
  TIERLIST_ROUTE,
  COUNTERS_ROUTE,
  STATS_ROUTE,
} from '../utils/config.js';

/////////////
// TODO: All these formatting tasks should be in a state class ??

const addChampionIds = (list, data) => {
  return list.forEach(champion => {
    data.champions[champion.name]
      ? (champion.id = data.champions[champion.name].id)
      : (champion.id = data.getChampionByName(champion.name).id);
  });
};

const addChampionImages = (list, data) => {
  return list.forEach(champion => {
    if (data.champions[champion.id])
      champion.img = data.champions[champion.id].img;
  });
};

const addChampionSprites = (list, data) => {
  return list.forEach(champion => {
    if (data.champions[champion.id])
      champion.sprite = data.champions[champion.id].sprite;
  });
};

const addIndexes = list => {
  return list.reduce((acc, champion) => {
    champion.index = acc;
    return ++acc;
  }, 0);
};

const completeListData = (list, data) => {
  addChampionIds(list, data);
  addChampionImages(list, data);
  addChampionSprites(list, data);
};

const sortList = (list, property) => {
  list.sort((a, b) => b[property] - a[property]);
};

const checkQuery = (lane, rank, vslane = true, champion = true) => {
  if (!champion || !lane || !rank || !vslane) {
    throw new Error(
      `Can't get a counterlist without parameters:${
        !state.champion ? ' (championId)' : ''
      }${!state.lane ? ' (lane)' : ''}${!state.rank ? ' (rank)' : ''}${
        !state.vslane ? ' (vslane)' : ''
      }`
    );
  }
};

// Get a list from API
const fetchListFromAPI = async (route, query) => {
  try {
    const response = await fetch(`${LOCAL_API}${route}${query}`);
    const { data } = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

// Arguments = {
//   state: {lane: vslane, rank, sortedBy: property},
//   data: appData,
// }
export async function getTierlist({ state, data }) {
  try {
    checkQuery(state.lane, state.rank);

    const route = TIERLIST_ROUTE;
    const query = `?lane=${state.lane}&rank=${state.rank}${
      state.patch ? `&patch=${state.patch}` : ''
    }${state.sortedBy ? `&sort=${state.sortedBy}` : ''}`;

    const { tierlist } = await fetchListFromAPI(route, query);
    completeListData(tierlist, data);
    addIndexes(tierlist);

    // if (state.sortedBy) sortList(tierlist, state.sortedBy);

    return tierlist;
  } catch (err) {
    throw err;
  }
}

// Arguments = {
//   state: {champion: id, lane, rank, vslane, sortedBy: property},
//   data: appData,
// }
export async function getChampionStats({ state }) {
  try {
    checkQuery(state.lane, state.rank, state.vslane, state.champion);
    // API works for lolalytics folders for champion names
    const route = `${STATS_ROUTE}/${state.champion}`;
    const query = `?lane=${state.lane}&rank=${state.rank}${
      state.patch ? `&patch=${state.patch}` : ''
    }`;

    return await fetchListFromAPI(route, query);
  } catch (err) {
    throw err;
  }
}

// Arguments = {
//   state: {champion: id, lane, rank, vslane, sortedBy: property},
//   data: appData,
// }
export async function getCounterList({ state, data }) {
  try {
    checkQuery(state.lane, state.rank, state.vslane, state.champion);
    // API works for lolalytics folders for champion names
    const route = `${COUNTERS_ROUTE}/${state.champion}`;
    const query = `?lane=${state.lane}&rank=${state.rank}${
      state.vslane ? `&vslane=${state.vslane}` : ''
    }${state.patch ? `&patch=${state.patch}` : ''}${
      state.sortedBy ? `&sort=${state.sortedBy}` : ''
    }`;

    const { counterList } = await fetchListFromAPI(route, query);
    completeListData(counterList, data);

    return counterList;
  } catch (err) {
    throw err;
  }
}

// Arguments = {
//   state: {champion: id, lane, rank, vslane, sortedBy: property},
//   data: appData,
//   tierlist: appState.tierlist
// }
export async function getStatsList({ state, data, tierlist }) {
  try {
    if (!tierlist) {
      throw new Error('Need a tierlist to get the stats...');
    }
    const counterList = await getCounterList({ state, data });

    return tierlist.map(opponent => {
      const [match] = counterList.filter(el => el.id === opponent.id);
      if (match) match.score = calcScore(state, match);
      return match ? match : { score: 0, winRatio: 0, delta2: 0 };
    });
  } catch (error) {
    throw err;
  }
}

function calcScore(champion, counter) {
  let score = Math.round(
    5 +
      (counter.winRatio - 50) * 0.45 +
      (counter.winRatio - champion.winRatio) * 0.1 +
      counter.delta1 * 0.13 +
      (champion.winRatio - counter.opponentWR) * 0.07 +
      counter.delta2 * 0.25
  );
  score = score > 9 ? 9 : score;
  score = score < 0 ? 0 : score;
  return score;
}
