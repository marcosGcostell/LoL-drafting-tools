import starterController from './controllers/starterController.js';
import countersController from './controllers/countersController.js';
import profileController from './controllers/profileController.js';
import signupController from './controllers/signupController.js';
import auth from './services/auth.js'; // auth.checkAuth() => returns user or null

function navigate(path) {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function handleRoute() {
  const path = window.location.pathname;

  // Bloqueo de rutas privadas si no está logueado
  const isLoggedIn = auth.isAuthenticated();

  if (path === '/' || path === '/starter') {
    starterController.init();
  } else if (path === '/counters') {
    if (!isLoggedIn) return navigate('/');
    countersController.init();
  } else if (path === '/profile') {
    if (!isLoggedIn) return navigate('/');
    profileController.init();
  } else if (path === '/signup') {
    if (isLoggedIn) return navigate('/counters');
    signupController.init();
  } else {
    document.body.innerHTML = '<h1>404 - Página no encontrada</h1>';
  }
}

window.addEventListener('DOMContentLoaded', handleRoute);
window.addEventListener('popstate', handleRoute);

export { navigate };
