import user from './model/userModel.js';
import * as backgroundController from './controllers/backgroundController.js';
import * as headerController from './controllers/global/headerController.js';
import * as starterController from './controllers/starterController.js';
import * as countersController from './controllers/countersController.js';
import * as profileController from './controllers/profileController.js';
// import * as signupController from './controllers/signupController.js';
import { LS_STATE } from './utils/config.js';

export const navigate = path => {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const loadCommonControllers = async () => {
  await headerController.init();
  await backgroundController.init();
};

const handleRoute = async e => {
  const path = window.location.pathname;
  const isDOMReloaded = !(e instanceof PopStateEvent);
  const isLoggedIn = user.isLoggedIn();

  if (path === '/' || path === '/starter') {
    const starter = await starterController.init();
    if (starter && isDOMReloaded) await loadCommonControllers();
  } else if (path === '/counters') {
    const localData = JSON.parse(sessionStorage.getItem(LS_STATE));
    if (!localData?.lane) return navigate('/');
    await countersController.init();
    if (isDOMReloaded) await loadCommonControllers();
  } else if (path === '/profile') {
    if (!isLoggedIn) return navigate('/');
    await profileController.init();
    if (isDOMReloaded) await loadCommonControllers();
    // } else if (path === '/signup') {
    //   if (isLoggedIn) return navigate('/counters');
    //   await signupController.init();
    //   await loadCommonControllers();
  } else {
    document.querySelector('main').innerHTML =
      '<h1>404 - Página no encontrada</h1>';
  }
};

window.addEventListener('DOMContentLoaded', handleRoute);
window.addEventListener('popstate', handleRoute);
