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

  _render() {
    const markup = this._generateMarkup();
    this._clear();
    this._componentElement.insertAdjacentHTML('beforeend', markup);
  }

  _clear() {
    this._componentElement.innerHTML = '';
  }

  toggle() {
    this._popUpElement.classList.toggle('hidden');
    this.isVisible = !this.isVisible;
    return this;
  }

  hide() {
    this.isVisible = false;
    this._popUpElement.classList.add('hidden');
  }

  setActiveItem(optionId) {
    Array.from(this._componentElement.children).forEach(el =>
      el.dataset.value === optionId
        ? el.classList.add('item__active')
        : el.classList.remove('item__active'),
    );
    this.value = optionId;
    return this;
  }

  changeParentButton(optionId) {
    const image = this._parentBtn.querySelector('img');
    const text = this._parentBtn.querySelector('span');

    image.setAttribute('src', `${this._path}${this._parentData[optionId].img}`);
    text.textContent = this._parentData[optionId].name;
    this.value = optionId;
  }
}
