import {
  LOCAL_API,
  TIERLIST_ROUTE,
  COUNTERS_ROUTE,
  STATS_ROUTE,
} from '../common/config.js';

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

const completeListData = (list, data) => {
  addChampionIds(list, data);
  addChampionImages(list, data);
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
//   state: {lane: vslaneSelected, rank, sortedBy: property},
//   data: appData,
// }
export async function getTierlist({ state, data }) {
  try {
    checkQuery(state.lane, state.rank);

    const route = TIERLIST_ROUTE;
    const query = `?lane=${state.lane}&rank=${state.rank}${
      state.sortedBy ? `&sort=${state.sortedBy}` : ''
    }`;

    const { tierlist } = await fetchListFromAPI(route, query);
    completeListData(tierlist, data);

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
    const query = `?lane=${state.lane}&rank=${state.rank}`;

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
    }${state.sortedBy ? `&sort=${state.sortedBy}` : ''}`;

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

    return tierlist.map(champion => {
      const [match] = counterList.filter(el => el.id === champion.id);
      return match ? match : { winRatio: 0, delta2: 0 };
    });
  } catch (error) {
    throw err;
  }
}
