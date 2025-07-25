import appState from '../../appState.js';
import HeaderView from '../../view/global/headerView.js';
import { navigate } from '../../utils/helpers.js';

let headerView;

const resetApp = () => {
  if (appState.popUpOn) return;

  if (appState.user.isLoggedIn) {
    appState.user.logout();
  } else {
    appState.resetAll();
  }
  navigate('/');
};

const btnHandler = e => {
  const target = e.target.closest('div').dataset.value;
  if (target === 'profile' && appState.currentPage === 'profile') {
    appState.setCurrentPage(appState.appMode);
    navigate(`/${appState.appMode}`);
  } else {
    appState.setCurrentPage(target);
    navigate(`/${target}`);
  }
};

const languageHandler = _ => {};

const toggleMode = _ => {
  if (appState.user.isLoggedIn !== headerView.loginMode) {
    const user = appState.user.isLoggedIn ? appState.user.username : undefined;
    headerView.toggleMode(user);
  }
};

// Init funcion for the view
export default async () => {
  headerView = new HeaderView();
  if (appState.user.isLoggedIn) toggleMode(appState.user.username);

  // Set the button handlers
  ['login', 'signup', 'profile'].forEach(btn =>
    headerView.addHandlerBtn(btn, btnHandler),
  );
  headerView.addHandlerBtn('language', languageHandler);

  ['user:login', 'user:logout', 'app:reload'].forEach(event =>
    appState.addEventListener(event, toggleMode),
  );

  // FIXME It should show a hint that it's a reset button
  document.querySelector('.header__logo').addEventListener('click', resetApp);
};
