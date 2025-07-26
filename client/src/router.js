import appData from './model/appData.js';
import user from './model/userModel.js';
import initHeader from './controllers/global/headerController.js';
import initStarter from './controllers/starterController.js';
import initCounters from './controllers/countersController.js';
import initLogin from './controllers/loginController.js';
import initProfile from './controllers/profileController.js';
// import initSignup from './controllers/signupController.js';
import { navigate } from './utils/helpers.js';
import { LS_STATE } from './utils/config.js';

const loadCommonControllers = async () => {
  await initHeader();
};

const handleRoute = async e => {
  const path = window.location.pathname;
  const isDOMReloaded = !(e instanceof PopStateEvent);
  const { isLoggedIn } = user;

  // Starter route
  if (path === '/' || path === '/starter') {
    const starter = await initStarter();
    if (starter && isDOMReloaded) await loadCommonControllers();
    // Counters route
  } else if (path === '/counters') {
    const localData = JSON.parse(sessionStorage.getItem(LS_STATE));
    if (!localData?.lane) return navigate('/');
    await initCounters();
    if (isDOMReloaded) await loadCommonControllers();
    // Login route
  } else if (path === '/login') {
    if (isLoggedIn) return navigate('/');
    await initLogin();
    if (isDOMReloaded) await loadCommonControllers();
    // Profile route
  } else if (path === '/profile') {
    if (!isLoggedIn) return navigate('/');
    await initProfile();
    if (isDOMReloaded) await loadCommonControllers();
    // } else if (path === '/signup') {
    //   if (isLoggedIn) return navigate('/counters');
    //   await signupController.init();
    //   await loadCommonControllers();
  } else {
    document.querySelector('main').innerHTML = '<h1>404 - Page not found</h1>';
  }
};

window.addEventListener('DOMContentLoaded', async e => {
  // TODO Improve this alerts with the errors
  try {
    await appData.init();
    if (!appData.integrity) {
      alert(
        'Champion IDs from website does not match Riot IDs. The application may not work properly',
      );
    }
    handleRoute(e);
  } catch (err) {
    if (!err.isOperational)
      return alert(
        'Something went wrong accesing Riot servers. Please restart the application',
      );
    if (err.type === 'champion') return alert(err.message);
    if (err.type === 'version') {
      alert(err.message);
      handleRoute(e);
    }
    alert(
      'Something went wrong at initilization. Please restart the application',
    );
  }
});
window.addEventListener('popstate', handleRoute);
