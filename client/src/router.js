import appData from './model/appData.js';
import user from './model/userModel.js';
import initBackground from './controllers/backgroundController.js';
import initHeader from './controllers/global/headerController.js';
import initStarter from './controllers/starterController.js';
import initCounters from './controllers/countersController.js';
import initProfile from './controllers/profileController.js';
// import initSignup from './controllers/signupController.js';
import { navigate } from './utils/helpers.js';
import { LS_STATE } from './utils/config.js';

const loadCommonControllers = async () => {
  await initHeader();
  await initBackground();
};

const handleRoute = async e => {
  const path = window.location.pathname;
  const isDOMReloaded = !(e instanceof PopStateEvent);
  const isLoggedIn = user.isLoggedIn();

  if (path === '/' || path === '/starter') {
    const starter = await initStarter();
    if (starter && isDOMReloaded) await loadCommonControllers();
  } else if (path === '/counters') {
    const localData = JSON.parse(sessionStorage.getItem(LS_STATE));
    if (!localData?.lane) return navigate('/');
    await initCounters();
    if (isDOMReloaded) await loadCommonControllers();
  } else if (path === '/profile') {
    if (!isLoggedIn) return navigate('/');
    await initProfile();
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

window.addEventListener('DOMContentLoaded', async e => {
  await appData.init();
  handleRoute(e);
});
window.addEventListener('popstate', handleRoute);
