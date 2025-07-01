export default class Patch {
  constructor(version) {
    this._riotVersion = version;
    this._patchState = 'version';
  }

  setVersionMode() {
    this._patchState = 'version';
    return this;
  }

  setTimeMode() {
    this._patchState = null;
    return this;
  }

  setState(patchState) {
    this._patchState = patchState;
    return this;
  }

  toggle() {
    this._patchState = this._patchState ? null : 'version';
    return this;
  }

  toState() {
    return this._patchState;
  }

  toView() {
    return this._patchState ? this._riotVersion : 'Last 7 days';
  }

  toApi() {
    return this._patchState ? '' : '7';
  }
}
