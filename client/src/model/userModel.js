import {
  loginOnAPI,
  getUserDataFromAPI,
  updateUserOnAPI,
} from '../services/apiCalls.js';
import { LS_USER } from '../utils/config.js';

class User extends EventTarget {
  constructor(userName = '', token = null) {
    super();
    this.#defaultValues();
    this.userName = userName;
    this.token = token;

    this.#load();
    this.#save();
  }

  #defaultValues() {
    this.__type = 'user';
    this.token = null;
    this.userName = '';
    this.name = '';
    this.email = '';
    this.config = {};
    this.data = {};
    this.response = '';
  }

  #valuesFromResponse(user) {
    this.name = user.name;
    this.userName = user.userName;
    this.email = user.email;
    this.config = user.config;
    this.data = user.data;
  }

  #load() {
    const localData = sessionStorage.getItem(LS_USER);
    if (!localData) return;
    try {
      const parsed = JSON.parse(localData);
      if (parsed.token && parsed.userName) {
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
    console.log('User class getData()');
    const { user, message } = await getUserDataFromAPI(this.token);
    console.log('user get: ', user);

    if (!user) {
      this.response =
        message || 'Could not get the user data from the database.';
      return null;
    }

    this.#valuesFromResponse(user);
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
        !(await this.login(this.userName, body.password, {
          silentMode: true,
        }))
      ) {
        this.response = `Could't login with new password. Error: ${this.response}`;
        return null;
      }
    } else {
      this.#valuesFromResponse(user);
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
    console.log('user class token: ', token);

    const user = await this.getData();
    console.log(user);
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

  fromJSON(_) {
    return this;
  }
}

export default new User();
