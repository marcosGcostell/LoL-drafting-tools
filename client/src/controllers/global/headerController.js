import appState from '../../appState.js';
import HeaderView from '../../view/global/headerView.js';
import { navigate } from '../../router.js';

let headerView;

export const resetApp = () => {
  if (appState.popUpOn) return;

  appState.user.isLoggedIn() ? appState.user.logout() : appState.resetAll();
  navigate('/');
};

const handleUserBtn = e => {
  if (appState.popUpOn) return;

  if (!appState.user.isLoggedIn()) {
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
  appState.user.isLoggedIn()
    ? headerView.showUserName(appState.user.username)
    : headerView.showUserName('Not logged in');
};

export async function init() {
  headerView = new HeaderView();

  // Set the login button handler
  headerView.addHandlerUserBtn(handleUserBtn);
  ['user:login', 'user:logout', 'app:reload'].forEach(event =>
    appState.addEventListener(event, userNameHandler),
  );

  userNameHandler(null);

  // FIXME This is a reset button for development on the logo
  document.querySelector('.header__logo').addEventListener('click', resetApp);
}
