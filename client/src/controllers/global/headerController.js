import appState from '../../appState.js';
import HeaderView from '../../view/global/headerView.js';
import { navigate } from '../../utils/helpers.js';

let headerView;

const resetApp = () => {
  if (appState.popUpOn) return;

  if (appState.user.isLoggedIn()) {
    appState.user.logout();
  } else {
    appState.resetAll();
  }
  navigate('/');
};

const handleUserBtn = e => {
  if (!appState.user.isLoggedIn()) {
    appState.hideAllPopUps('login');
    appState.triggerPopUp('login');
    e.stopPropagation();
    return;
  }
  if (appState.currentPage === 'profile') {
    appState.setCurrentPage(appState.appMode);
    navigate(`/${appState.appMode}`);
  } else {
    appState.setCurrentPage('profile');
    navigate('/profile');
  }
};

const userNameHandler = _ => {
  if (appState.user.isLoggedIn()) {
    headerView.showUserName(appState.user.username);
  } else {
    headerView.showUserName('Not logged in');
  }
};

// Init funcion for the view
export default async () => {
  headerView = new HeaderView();

  // Set the login button handler
  headerView.addHandlerUserBtn(handleUserBtn);
  ['user:login', 'user:logout', 'app:reload'].forEach(event =>
    appState.addEventListener(event, userNameHandler),
  );

  userNameHandler(null);

  // FIXME It should show a hint that it's a reset button
  document.querySelector('.header__logo').addEventListener('click', resetApp);
};
