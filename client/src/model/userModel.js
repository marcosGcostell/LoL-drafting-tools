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
    this.response = '';
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

  async getData() {
    const { user, message } = await getUserDataFromAPI(this.token);

    if (!user) {
      this.response =
        message || 'Could not get the user data from the database.';
      return null;
    }

    this.valuesFromResponse(user);
    return this;
  }

  async updateUser(body) {
    const { user, message } = await updateUserOnAPI(this.token, body);

    if (!user) {
      this.response = message || 'Could not update the user';
      return null;
    }

    if (body?.password) {
      if (
        !(await this.login(this.username, body.password, {
          silentMode: true,
        }))
      ) {
        this.response = `Could't login with new password. Error: ${this.response}`;
        return null;
      }
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

    if (!token) {
      this.response = message || 'Could not logged in.';
      return null;
    }
    this.token = token;

    const user = await this.getData();
    if (!user) {
      this.response = 'Could not get the user data after logged in';
      return null;
    }

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
