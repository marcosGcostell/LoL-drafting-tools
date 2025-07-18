import {
  loginOnAPI,
  getUserDataFromAPI,
  updateUserOnAPI,
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

    if (body?.password) {
      const result = await this.login(this.username, body.password, {
        silentMode: true,
      });
      if (!result) return { message: 'Could not login with new password' };
    } else {
      this.valuesFromResponse(user);
      this.#save();
    }
    return user;
  }

  getUpdated() {
    return this;
  }

  isLoggedIn() {
    return Boolean(this.token);
  }

  async login(loginName, password, { silentMode = false } = {}) {
    const { token, message } = await loginOnAPI(loginName, password);

    if (!token) return { message: message || 'Could not logged in.' };
    this.token = token;

    const user = await this._getData();
    if (!user)
      return { message: 'Could not get the user data after logged in' };

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
