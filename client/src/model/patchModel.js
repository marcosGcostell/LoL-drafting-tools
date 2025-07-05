export default class Patch {
  constructor(version) {
    this._riotVersion = version;
    this._patchState = 'version';
    this.__type = 'Patch';
  }

  get state() {
    return this._patchState;
  }

  set state(patchState) {
    this._patchState = patchState;
  }

  setVersionMode() {
    this._patchState = 'version';
    return this;
  }

  setTimeMode() {
    this._patchState = null;
    return this;
  }

  toggle() {
    this._patchState = this._patchState ? null : 'version';
    return this;
  }

  toView() {
    return this._patchState ? this._riotVersion : 'Last 7 days';
  }

  toApi() {
    return this._patchState ? '' : '7';
  }

  static fromJSON(obj) {
    const patch = new Patch(obj._riotVersion);
    patch.state = obj._patchState;
    return patch;
  }
}
