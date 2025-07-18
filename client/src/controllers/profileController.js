import appState from '../appState.js';
import UserCache from '../model/UserCacheModel.js';
import { getChanges } from '../model/profileModel.js';
import { initUserData, isFormActive } from './profile/userDataController.js';
import initUserPool from './profile/userPoolController.js';
import UserHeaderView from '../view/profile/userHeaderView.js';
import { PROFILE_PAGE_TEMPLATE } from '../utils/config.js';
import { wait, navigate } from '../utils/helpers.js';

let userHeaderView;
let userCache;

const logout = () => {
  userCache.deleteCache();
  appState.user.logout();
  navigate('/');
};

const discardChanges = () => {
  userCache.deleteCache();
  appState.setCurrentPage(appState.appMode);
  navigate(`/${appState.appMode}`);
};

const saveProfile = async () => {
  if (isFormActive()) return;

  const userChanges = getChanges(userCache, appState.user);
  if (!Object.keys(userChanges).length) return discardChanges();

  try {
    const user = await appState.user.updateUser(userChanges);
    if (user.message) {
      userHeaderView.headerMessage.textContent = user.message;
      // await wait(1);
      // userHeaderView.headerMessage.textContent = '';
      return;
    }

    userHeaderView.headerMessage.textContent = '✅ User successfully updated.';
    await wait(1);
    userHeaderView.headerMessage.textContent = '';
    discardChanges();
  } catch (err) {
    userHeaderView.headerMessage.textContent =
      'Something went wrong with the server. Could not save the changes';
  }
};

// Init funcion for loading the page
export default async () => {
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
    initUserData(userCache);
    initUserPool(userCache);

    // Set handlers for the header buttons
    userHeaderView.addHandlerBtn('logout', logout);
    userHeaderView.addHandlerBtn('save', saveProfile);
    userHeaderView.addHandlerBtn('discard', discardChanges);
  } catch (err) {
    // TODO should handle error here
    throw err;
  }
};
