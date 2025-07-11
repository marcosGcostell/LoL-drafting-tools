export default class Component {
  constructor({ style, id, type, template = null }) {
    this._style = style;
    this.id = id;
    this._componentElement = document.querySelector(`#${id}__${type}`);
    if (template) {
      this._template = null;
      this._templatePromise = fetch(template)
        .then(response => response.text())
        .then(data => {
          this._template = data;
          return data;
        });
    }
  }

  addHandlers(selectorHandler, parentHandler = null) {
    if (selectorHandler) {
      this._componentElement.addEventListener('click', e => {
        e.preventDefault();
        selectorHandler(e, this);
      });
    }
    if (parentHandler) {
      this._parentBtn.addEventListener('click', e => {
        e.preventDefault();
        parentHandler(e, this);
      });
    }
  }
}
