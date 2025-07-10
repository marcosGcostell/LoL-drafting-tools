export default class Patch {
  constructor(version) {
    this._riotVersion = version;
    this._patchMode = '';
    this.__type = 'Patch';
  }

  get mode() {
    return this._patchMode;
  }

  set mode(patchMode) {
    this._patchMode = patchMode;
  }

  setVersionMode() {
    this._patchMode = '';
    return this;
  }

  setTimeMode() {
    this._patchMode = '7';
    return this;
  }

  toggle() {
    this._patchMode = this._patchMode ? '' : '7';
    return this;
  }

  toView() {
    return this.strToView(this._patchMode);
  }

  toProfile() {
    return this.strToProfile(this._patchMode);
  }

  strToView(str) {
    return str ? 'Last 7 days' : this._riotVersion;
  }

  strToProfile(str) {
    return str ? 'Last 7 days' : 'Current game version';
  }

  static fromJSON(obj) {
    const patch = new Patch(obj._riotVersion);
    patch.mode = obj._patchMode;
    return patch;
  }
}
