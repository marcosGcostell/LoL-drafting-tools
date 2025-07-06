import appState from '../../appState.js';
import LoginView from '../../view/global/loginView.js';
import { validateAuthForm } from '../../services/auth.js';

let loginView;

export const toggleModal = e => {
  if (!appState.popUpOn || appState.popUpOn === 'login') {
    loginView.toggleModal();
    appState.popUpOn = loginView.isModalShowed ? 'login' : '';
  }
};

const loginHandler = async e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const userName = formData.get('username')?.trim();
  const password = formData.get('password');

  const errorMessage = validateAuthForm({ userName, password });
  if (errorMessage) {
    loginView.errorMessage = errorMessage;
    loginView.renderError();
    return;
  }

  const result = await appState.user.login(userName, password);
  if (!result) {
    loginView.errorMessage = appState.user.response;
    loginView.renderError();
  } else {
    loginView.closeModal();
    appState.popUpOn = '';
  }
};

const btnSignupHandler = e => {};

export const setHandlers = () => {
  loginView = new LoginView();
  loginView.init();
  loginView.addHandlerModalBtns('close', toggleModal);
  loginView.addHandlerModalBtns('signup', btnSignupHandler);
  loginView.addHandlerForm(loginHandler);
  loginView.addHandlerModalBackground();

  appState.addEventListener('popup:login', toggleModal);
};
