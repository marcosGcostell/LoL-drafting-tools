import appState from '../appState.js';
import * as userDataController from './profile/userDataController.js';
import { resetApp } from './global/headerController.js';
import UserHeaderView from '../view/profile/userHeaderView.js';
import { PROFILE_PAGE_TEMPLATE } from '../utils/config.js';
import { navigate } from '../router.js';
import { wait } from '../utils/helpers.js';

let userHeaderView;

// TODO implement header buttons handlers
const logout = () => {
  resetApp();
};

const saveProfile = async () => {
  if (userDataController.isFormActive()) return;

  const data = userDataController.getFormChanges();
  if (!Object.keys(data).length) discardChanges();

  try {
    const result = await appState.user.updateData(data);
    if (result) {
      userHeaderView.headerMessage.textContent =
        '✅ User successfully updated.';
      await wait(1);
      userHeaderView.headerMessage.textContent = '';
      discardChanges();
    }

    userHeaderView.headerMessage.textContent = appState.user.response;
    await wait(1);
    userHeaderView.headerMessage.textContent = '';
  } catch (err) {}
};

const discardChanges = () => {
  appState.setCurrentPage(appState.appMode);
  navigate(`/${appState.appMode}`);
};

export const init = async () => {
  try {
    // Insert the HTML page
    const response = await fetch(PROFILE_PAGE_TEMPLATE);
    const template = await response.text();
    if (!template) throw new Error('HTML template is not found');

    document.querySelector('main').innerHTML = template;
    appState.setCurrentPage('profile');

    // initialize the views
    userHeaderView = new UserHeaderView();
    userDataController.init();

    // Set handlers for the header buttons
    userHeaderView.addHandlerBtn('logout', logout);
    userHeaderView.addHandlerBtn('save', saveProfile);
    userHeaderView.addHandlerBtn('discard', discardChanges);
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
