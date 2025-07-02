import User from './model/userModel.js';
import * as mainController from './controllers/mainController.js';
import * as starterController from './controllers/starterController.js';
import * as countersController from './controllers/countersController.js';
// import profileController from './controllers/profileController.js';
// import signupController from './controllers/signupController.js';

export const navigate = path => {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const handleRoute = async () => {
  const path = window.location.pathname;

  const isLoggedIn = User.isLoggedIn();

  if (path === '/' || path === '/starter') {
    await starterController.init();
    await mainController.init();
  } else if (path === '/counters') {
    const localData = JSON.parse(sessionStorage.getItem(LS_STATE));
    if (!localData?.lane) return navigate('/');
    await countersController.init();
    await mainController.init();
    // } else if (path === '/profile') {
    //   if (!isLoggedIn) return navigate('/');
    //   await profileController.init();
    //   await mainController.init();
    // } else if (path === '/signup') {
    //   if (isLoggedIn) return navigate('/counters');
    //   await signupController.init();
    //   await mainController.init();
  } else {
    document.querySelector('main').innerHTML =
      '<h1>404 - Página no encontrada</h1>';
  }
};

window.addEventListener('DOMContentLoaded', handleRoute);
window.addEventListener('popstate', handleRoute);
