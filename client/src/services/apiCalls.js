import {
  LOCAL_API,
  CHECK_USER_ROUTE,
  LOGIN_ROUTE,
  USER_ROUTE,
} from '../utils/config.js';

const _checkQuery = ({ lane, rank, vslane = true }) => {
  if (!lane || !rank || !vslane) {
    throw new Error(
      `Can't get a counterlist without parameters:${
        !state.lane ? ' (lane)' : ''
      }${!state.rank ? ' (rank)' : ''}${!state.vslane ? ' (vslane)' : ''}`,
    );
  }
};

export const fetchListFromAPI = async (route, queryData) => {
  try {
    _checkQuery(queryData);
    const query = `?lane=${queryData.lane}&rank=${queryData.rank}${
      queryData.vslane ? `&vslane=${queryData.vslane}` : ''
    }${queryData.patch.mode ? `&patch=${queryData.patch.mode}` : ''}${
      queryData.sortedBy ? `&sort=${queryData.sortedBy}` : ''
    }`;

    const response = await fetch(`${LOCAL_API}${route}${query}`);
    const { data } = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const checkUserFromAPI = async body => {
  try {
    const response = await fetch(`${LOCAL_API}${CHECK_USER_ROUTE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const { message, isValid } = await response.json();
    if (isValid) return null;
    if (message) return message;
    return 'Field are not valid';
  } catch (err) {
    return err.message;
  }
};

export const getUserDataFromAPI = async token => {
  if (!token) return { message: 'You need to be logged in to update the user' };

  try {
    const response = await fetch(`${LOCAL_API}${USER_ROUTE}`, {
      // method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const { data } = await response.json();

    if (!data?.user) {
      return { message: 'Could not get the user data from the database.' };
    }

    return { user: data.user };
  } catch (err) {
    return { message: err.message };
  }
};

export const updateUserOnAPI = async (token, body) => {
  if (!token) return { message: 'You need to be logged in to update the user' };
  if (!body) return { message: 'You need to send data to update' };

  try {
    const response = await fetch(`${LOCAL_API}${USER_ROUTE}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const { data } = await response.json();

    if (!data?.user) {
      return { message: 'Could not update the user data.' };
    }
    return { user: data.user };
  } catch (err) {
    return { message: err.message };
  }
};

export const loginOnAPI = async (loginName, password) => {
  if (!loginName || !password) {
    return { message: 'Please, provide an username or email and a password.' };
  }
  try {
    const response = await fetch(`${LOCAL_API}${LOGIN_ROUTE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginName,
        email: loginName,
        password,
      }),
    });

    const { token, message } = await response.json();
    return { token, message };
  } catch (err) {
    return { message: err.message };
  }
};
