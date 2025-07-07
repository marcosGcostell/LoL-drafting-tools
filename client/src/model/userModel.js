import {
  LOCAL_API,
  USER_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  LS_USER,
} from '../utils/config.js';

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
    if (!this.token) return null;

    try {
      const response = await fetch(`${LOCAL_API}${USER_ROUTE}`, {
        // method: 'GET',
        headers: { Authorization: `Bearer ${this.token}` },
      });

      const { data } = await response.json();

      if (!data?.user) {
        this.response = 'Could not get the user data from the database.';
        return null;
      }
      this.name = data.user.name;
      this.userName = data.user.userName;
      this.email = data.user.email;
      this.config = data.user.config;
      this.data = data.user.data;
      return this;
    } catch (err) {
      this.response = err.message;
      return null;
    }
  }

  getUpdated() {
    return this;
  }

  isLoggedIn() {
    return Boolean(this.token);
  }

  async checkUserPassword(userName, password) {
    if (!userName || !password) {
      this.response = 'Please, provide an username or email and a password.';
      return null;
    }
    try {
      const response = await fetch(`${LOCAL_API}${LOGIN_ROUTE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
      });

      const { token, message } = await response.json();
      return { token, message };
    } catch (err) {
      this.response = err.message;
      return null;
    }
  }

  async login(userName, password) {
    try {
      const { token, message } = await this.checkUserPassword(
        userName,
        password
      );

      if (token) {
        this.userName = userName;
        this.token = token;

        const data = await this.getData();
        if (!data) return null;

        this.#save();
        console.log('Logged from user. Dispatching event...');
        this.dispatchEvent(new Event('login'));
        return data;
      } else {
        this.response = message;
        return null;
      }
    } catch (err) {
      this.response = err.message;
      return null;
    }
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
