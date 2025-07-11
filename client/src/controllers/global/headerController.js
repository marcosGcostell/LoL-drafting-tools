import appState from '../../appState.js';
import HeaderView from '../../view/global/headerView.js';
import { navigate } from '../../router.js';

let headerView;

export const resetApp = () => {
  appState.user.isLoggedIn() ? appState.user.logout() : appState.resetAll();
  navigate('/');
};

const handleUserBtn = e => {
  if (appState.user.isLoggedIn()) {
    appState.setCurrentPage('profile');
    navigate('/profile');
  } else {
    appState.triggerPopUp('login');
    e.stopPropagation();
  }
};

const userNameHandler = _ => {
  appState.user.isLoggedIn()
    ? headerView.showUserName(appState.user.userName)
    : headerView.showUserName('Not logged in');
};

export async function init() {
  headerView = new HeaderView();

  // Set the login button handler
  headerView.addHandlerUserBtn(handleUserBtn);
  ['user:login', 'user:logout', 'app:reload'].forEach(event =>
    appState.addEventListener(event, userNameHandler)
  );

  userNameHandler(null);

  // FIXME This is a reset button for development on the logo
  document.querySelector('.header__logo').addEventListener('click', resetApp);
}
