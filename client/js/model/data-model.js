import { LOCAL_API, TIERLIST_ROUTE, COUNTERS_ROUTE } from '../common/config.js';

const fetchListFromAPI = async (route, query) => {
  try {
    const response = await fetch(`${LOCAL_API}${route}${query}`);
    const { data } = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

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

export async function getCounterList({ state, data }) {
  try {
    if (!state.id || !state.lane || !state.rank || !state.vslane) {
      throw new Error(
        `Can't get a counterlist without parameters:${
          !state.id ? ' (championId)' : ''
        }${!state.lane ? ' (lane)' : ''}${!state.rank ? ' (rank)' : ''}${
          !state.vslane ? ' (vslane)' : ''
        }`
      );
    }
    // API works for lolalytics folders for champion names
    const route = `${COUNTERS_ROUTE}/${data.champions[champion].id}`;
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

export async function getTierList({ state, data }) {
  try {
    if (!state.lane || !state.rank) {
      throw new Error(
        `Can't get a counterlist without parameters:${
          !state.lane ? ' (lane)' : ''
        }${!state.rank ? ' (rank)' : ''}`
      );
    }
    const route = TIERLIST_ROUTE;
    const query = `?lane=${state.lane}&rank=${state.rank}${
      state.sortedBy ? `&sort=${state.sortedBy}` : ''
    }`;

    const { tierlist } = await fetchListFromAPI(route, query);
    completeListData(tierlist, data);

    // FIXME sort doesn't work on API tierlist. Only in counterlist
    if (state.sortedBy) sortList(tierlist, state.sortedBy);

    return tierlist;
  } catch (err) {
    throw err;
  }
}
