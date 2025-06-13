import * as model from '../model/model.js';
import inputsView from '../view/inputs-view.js';

const displayOptionsHandler = target => {
  inputsView.toggleSelector(target);
};

export async function initInputs() {
  inputsView.addHandlerBtn(displayOptionsHandler, 'lane');
  inputsView.addHandlerBtn(displayOptionsHandler, 'vslane');
  inputsView.addHandlerBtn(displayOptionsHandler, 'rank');
  inputsView.addHandlerBtn(displayOptionsHandler, 'patch');

  await inputsView.buildSelectors(
    model.appData.roles,
    model.appData.ranks,
    model.appData.version
  );
}
