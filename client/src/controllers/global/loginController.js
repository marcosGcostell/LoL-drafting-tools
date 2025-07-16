import appState from '../../appState.js';
import LoginView from '../../view/global/loginView.js';
import { validateAuthForm } from '../../services/auth.js';

let loginView;

const hideModal = e => {
  const exclude = e.detail?.exclude || null;

  if (loginView.isModalShowed && exclude !== 'login') {
    loginView.toggleModal();
    appState.popUpOn = '';
  }
};

export const toggleModal = () => {
  // if (!appState.popUpOn || appState.popUpOn === 'login') {
  loginView.toggleModal();
  appState.popUpOn = loginView.isModalShowed ? 'login' : '';
  // }
};

const loginHandler = async e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const username = formData.get('username')?.trim();
  const password = formData.get('password');

  const errorMessage = await validateAuthForm({ username, password });
  if (errorMessage) {
    loginView.errorMessage = errorMessage;
    loginView.renderError();
    return;
  }

  const result = await appState.user.login(username, password);
  if (!result) {
    loginView.errorMessage = appState.user.response;
    loginView.renderError();
  } else {
    loginView.closeModal();
    appState.popUpOn = '';
  }
};

const btnSignupHandler = () => {};

export const init = () => {
  loginView = new LoginView();
  loginView.initView();
  loginView.addHandlerModalBtns('close', toggleModal);
  loginView.addHandlerModalBtns('signup', btnSignupHandler);
  loginView.addHandlerForm(loginHandler);
  loginView.addHandlerModalBackground();

  appState.addEventListener('popup:login', toggleModal);
  appState.addEventListener('popup:hideAll', hideModal);
};
