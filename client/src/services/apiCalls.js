import { LOCAL_API } from '../utils/config.js';

const _checkQuery = ({ lane, rank, vslane = true }) => {
  if (!lane || !rank || !vslane) {
    throw new Error(
      `Can't get a counterlist without parameters:${
        !state.lane ? ' (lane)' : ''
      }${!state.rank ? ' (rank)' : ''}${!state.vslane ? ' (vslane)' : ''}`
    );
  }
};

export default fetchListFromAPI = async (route, queryData) => {
  try {
    _checkQuery(queryData);
    const query = `?lane=${queryData.lane}&rank=${queryData.rank}${
      queryData.vslane ? `&vslane=${queryData.vslane}` : ''
    }${queryData.patch.toApi()}${
      state.sortedBy ? `&sort=${state.sortedBy}` : ''
    }`;

    const response = await fetch(`${LOCAL_API}${route}${query}`);
    const { data } = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};
