import * as model from '../model/model.js';
import inputsView from '../view/inputs-view.js';

const displayOptionsHandler = target => {
  inputsView.toggleSelector(target);
};

const selectorHandler = (target, id) => {
  if (id) {
    // TODO Check in appState if actually has changed
    const option =
      target === 'rank' ? model.appData.ranks[id] : model.appData.roles[id];
    console.log(target, id, option);
    inputsView.toggleSelector(target);
    inputsView.changeOption(target, option);
    if (target === 'lane') {
      inputsView.changeOption('vslane', option);
    }
  }
};

export async function initInputs() {
  ['lane', 'vslane', 'rank', 'patch'].forEach(el =>
    inputsView.addHandlerBtn(displayOptionsHandler, el)
  );

  await inputsView.buildSelectors(
    model.appData.toSortedArray('roles'),
    model.appData.toSortedArray('ranks'),
    model.appData.version
  );

  ['lane', 'vslane', 'rank'].forEach(el =>
    inputsView.addHandlerSelector(selectorHandler, el)
  );
}
