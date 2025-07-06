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
    this._userName = userName;
    this._token = token;

    this.#load();
    this.#save();
  }

  get userName() {
    return this._userName;
  }

  get token() {
    return this._token;
  }

  #defaultValues() {
    this.__type = 'user';
    this._token = null;
    this._userName = '';
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
        this._userName = parsed.userName;
        this._token = parsed.token;
        this.dispatchEvent(new Event('login'));
      }
    } catch (err) {
      throw err;
    }
  }

  #save() {
    sessionStorage.setItem(
      LS_USER,
      JSON.stringify({
        userName: this._userName,
        token: this._token,
      })
    );
  }

  async getData() {
    if (!this._token) return null;

    try {
      const response = await fetch(`${LOCAL_API}${USER_ROUTE}`, {
        // method: 'GET',
        headers: { Authorization: `Bearer ${this._token}` },
      });

      const { data } = await response.json();

      if (!data?.user) {
        this.response = 'Could not get the user data from the database.';
        return null;
      }
      this.name = data.user.name;
      this._userName = data.user.userName;
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
    return Boolean(this._token);
  }

  async login(userName, password) {
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
      if (token) {
        this._userName = userName;
        this._token = token;

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

  fromJSON(obj) {
    // const user = new User(obj.userName, obj.token);
    // return user;
    return this;
  }
}

export default new User();
