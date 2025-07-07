import { LOCAL_API, CHECK_USER_ROUTE } from '../utils/config.js';

const _checkQuery = ({ lane, rank, vslane = true }) => {
  if (!lane || !rank || !vslane) {
    throw new Error(
      `Can't get a counterlist without parameters:${
        !state.lane ? ' (lane)' : ''
      }${!state.rank ? ' (rank)' : ''}${!state.vslane ? ' (vslane)' : ''}`
    );
  }
};

export const fetchListFromAPI = async (route, queryData) => {
  try {
    _checkQuery(queryData);
    const query = `?lane=${queryData.lane}&rank=${queryData.rank}${
      queryData.vslane ? `&vslane=${queryData.vslane}` : ''
    }${`&patch=${queryData.patch.mode}`}${
      queryData.sortedBy ? `&sort=${queryData.sortedBy}` : ''
    }`;

    const response = await fetch(`${LOCAL_API}${route}${query}`);
    const { data } = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const checkUserFromAPI = async query => {
  try {
    const response = await fetch(`${LOCAL_API}${CHECK_USER_ROUTE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    const { message, isValid } = await response.json();
    if (isValid) return null;
    if (message) return message;
    return 'Field are not valid';
  } catch (err) {
    throw err;
  }
};
