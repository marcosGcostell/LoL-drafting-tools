import Patch from '../../model/patchModel.js';
import Component from './component.js';

export default class PatchComponent extends Component {
  constructor({ style, id }) {
    super({ style, id, type: 'btn' });
    this._patch = new Patch();
    this._format = new Map([
      ['counters', this._patch.toView.bind(this._patch)],
      ['profile', this._patch.toProfile.bind(this._patch)],
    ]);
  }

  get mode() {
    return this._patch.mode;
  }

  set mode(mode) {
    this._patch.mode = mode;
    this._renderText();
  }

  load() {
    this._renderText();
    return this;
  }

  toggle() {
    this._patch.mode = this._patch.toggle().mode;
    this._renderText();
  }

  _renderText() {
    this._componentElement.querySelector('span').textContent = this._format.get(
      this._style,
    )();
  }
}
