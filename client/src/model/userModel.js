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
    this._userName = userName;
    this._token = token;
    this.__type = 'User';

    this.#load();
    this.#save();
  }

  get userName() {
    return this._userName;
  }

  get token() {
    return this._token;
  }

  isLoggedIn() {
    return Boolean(this._token);
  }

  async login(userName, password) {
    if (!this._userName) return null;
    try {
      const response = await fetch(`${LOCAL_API}${LOGIN_ROUTE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
      });

      const { token } = await response.json();
      if (token) {
        this._token = token;
        this.#save();
        this.dispatchEvent(new Event('login'));
        return token;
      } else {
        this.logout();
        return null;
      }
    } catch (err) {
      // TODO Need to handle the error here?
      this.logout();
      throw err;
    }
  }

  logout() {
    this._userName = '';
    this._token = null;
    sessionStorage.removeItem(LS_USER);
    this.dispatchEvent(new Event('logout'));
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

  static fromJSON(obj) {
    const user = new User(obj.userName, obj.token);
    return user;
  }
}

export default new User();
