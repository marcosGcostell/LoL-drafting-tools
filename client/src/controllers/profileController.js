import appState from '../appState.js';
import UserCache from '../model/UserCacheModel.js';
import { hasBeenChanges } from '../model/profileModel.js';
import * as userDataController from './profile/userDataController.js';
import * as userPoolController from './profile/userPoolController.js';
import UserHeaderView from '../view/profile/userHeaderView.js';
import { resetApp } from './global/headerController.js';
import { PROFILE_PAGE_TEMPLATE } from '../utils/config.js';
import { navigate } from '../router.js';
import { wait } from '../utils/helpers.js';

let userHeaderView;
let userCache;

const logout = () => {
  userCache.deleteCache();
  resetApp();
};

const saveProfile = async () => {
  if (userDataController.isFormActive()) return;

  if (!hasBeenChanges(userCache, appState.user)) {
    return discardChanges();
  }

  try {
    const user = await appState.user.updateUser(userCache);
    if (user) {
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
  userCache.deleteCache();
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

    // set user cache and initialize the views
    userCache = new UserCache(appState.user);
    userHeaderView = new UserHeaderView();
    userDataController.init(userCache);
    userPoolController.init(userCache);

    // Set handlers for the header buttons
    userHeaderView.addHandlerBtn('logout', logout);
    userHeaderView.addHandlerBtn('save', saveProfile);
    userHeaderView.addHandlerBtn('discard', discardChanges);
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
