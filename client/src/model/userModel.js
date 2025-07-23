import {
  loginOnAPI,
  getUserDataFromAPI,
  updateUserOnAPI,
  updatePasswordOnAPI,
} from '../services/apiCalls.js';
import { LS_USER } from '../utils/config.js';

class User extends EventTarget {
  constructor(username = '', token = null) {
    super();
    this.#defaultValues();
    this.username = username;
    this.token = token;

    this.#load();
    this.#save();
  }

  #defaultValues() {
    this.__type = 'user';
    this.token = null;
    this.username = '';
    this.name = '';
    this.email = '';
    this.config = {};
    this.data = {};
  }

  valuesFromResponse(user) {
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    Object.assign(this.config, user.config);
    Object.assign(this.data, user.data);
  }

  #load() {
    const localData = sessionStorage.getItem(LS_USER);
    if (!localData) return;
    try {
      const parsed = JSON.parse(localData);
      if (parsed.token && parsed.username) {
        Object.assign(this, parsed);
        this.dispatchEvent(new Event('login'));
      }
    } catch (err) {
      throw err;
    }
  }

  #save() {
    const data = { ...this };
    sessionStorage.setItem(LS_USER, JSON.stringify(data));
  }

  async _getData() {
    const { user } = await getUserDataFromAPI(this.token);

    if (!user) return null;

    this.valuesFromResponse(user);
    return this;
  }

  async updateUser(body) {
    const { user, message } = await updateUserOnAPI(this.token, body);

    if (!user) return { message: message || 'Could not update the user' };

    this.valuesFromResponse(user);
    this.#save();

    return this;
  }

  async updatePassword(body) {
    const { token, user, message } = await updatePasswordOnAPI(
      this.token,
      body,
    );

    if (!user || !token)
      return { message: message || 'Could not update the password' };

    this.valuesFromResponse(user);
    this.#save();

    return this;
  }

  getUpdated() {
    return this;
  }

  isLoggedIn() {
    return Boolean(this.token);
  }

  async login(loginName, password, { silentMode = false } = {}) {
    const { token, user, message } = await loginOnAPI(loginName, password);

    if (!token) return { message: message || 'Could not logged in.' };
    this.token = token;
    if (!user)
      return { message: 'Could not get the user data after logged in' };

    this.valuesFromResponse(user);
    this.#save();
    if (!silentMode) this.dispatchEvent(new Event('login'));
    return this;
  }

  logout({ fireEvent = true } = {}) {
    this.#defaultValues();
    sessionStorage.removeItem(LS_USER);
    if (fireEvent) this.dispatchEvent(new Event('logout'));
  }

  setPoolOptions(target, value) {
    if (target) {
      this.data[target] = value;
      this.#save();
    }
  }

  setPoolChampions(lane, pool) {
    if (lane && pool) {
      this.data.championPool[lane] = pool;
      this.#save();
    }
  }

  fromJSON(_) {
    return this;
  }
}

export default new User();
