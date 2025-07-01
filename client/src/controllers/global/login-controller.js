import appState from '../../app-state.js';
import loginView from '../../view/global/login-view.js';

export const handleUserBtn = e => {
  // TODO Need to call the profile controller
  if (appState.userName) return;

  if (
    !appState.popUpOn ||
    appState.popUpOn === 'login' ||
    appState.popUpOn === 'starter'
  ) {
    loginView.toggleModal();
    appState.popUpOn = loginView.isPanelShowed ? 'login' : '';
    e.stopPropagation();
  }
};

export const setHandlers = () => {
  loginView.addHandlerUserBtn(handleUserBtn);
};

export const resetView = () => {
  loginView.reset();
};
