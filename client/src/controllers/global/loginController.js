import appState from '../../appState.js';
import LoginView from '../../view/global/loginView.js';

let loginView;

export const handleUserBtn = e => {
  // TODO Need to call the profile controller
  if (appState.user?.userName) return;

  if (!appState.popUpOn || appState.popUpOn === 'login') {
    loginView.toggleModal();
    appState.popUpOn = loginView.isPanelShowed ? 'login' : '';
    e.stopPropagation();
  }
};

export const setHandlers = () => {
  loginView = new LoginView();
  loginView.init();
  loginView.addHandlerUserBtn(handleUserBtn);
};

export const resetView = () => {
  loginView.reset();
};
