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
      this.#valuesFromResponse(data.user);
      return this;
    } catch (err) {
      this.response = err.message;
      return null;
    }
  }

  async updateData(body) {
    if (!this.token || !body) return null;

    try {
      const response = await fetch(`${LOCAL_API}${USER_ROUTE}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const { data } = await response.json();

      if (!data?.user) {
        this.response = 'Could not update the user data.';
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
        this.#valuesFromResponse(data.user);
        this.#save();
      }
      return data;
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

  async apiLoginRequest(loginName, password) {
    if (!loginName || !password) {
      this.response = 'Please, provide an username or email and a password.';
      return null;
    }
    try {
      const response = await fetch(`${LOCAL_API}${LOGIN_ROUTE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: loginName,
          email: loginName,
          password,
        }),
      });

      const { token, message } = await response.json();
      return { token, message };
    } catch (err) {
      this.response = err.message;
      return null;
    }
  }

  async login(loginName, password, { silentMode = false } = {}) {
    try {
      const { token, message } = await this.apiLoginRequest(
        loginName,
        password
      );

      if (!token) {
        this.response = message;
        return null;
      }

      // this.userName = userName;
      this.token = token;

      const data = await this.getData();
      if (!data) {
        this.response = 'Could not get the user data after logged in';
        return null;
      }

      this.#save();
      if (!silentMode) this.dispatchEvent(new Event('login'));
      return data;
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

  updateToken(token) {
    this.token = token;
    this.#save();
  }

  fromJSON(_) {
    return this;
  }
}

export default new User();
