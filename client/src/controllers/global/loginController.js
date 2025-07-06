import User from '../../model/userModel.js';
import appState from '../../appState.js';
import LoginView from '../../view/global/loginView.js';
import { validateAuthForm } from '../../services/auth.js';

let loginView;

export const handleUserBtn = e => {
  // TODO Need to call the profile controller
  if (appState.user?.userName) return;

  if (!appState.popUpOn || appState.popUpOn === 'login') {
    loginView.toggleModal();
    appState.popUpOn = loginView.isModalShowed ? 'login' : '';
    e.stopPropagation();
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

  console.log('Sending data to log in...');
  const result = await User.login(userName, password);
  console.log('Login completed!');
  if (!result) {
    loginView.errorMessage = User.response;
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
  loginView.addHandlerUserBtn(handleUserBtn);
  loginView.addHandlerModalBtns('close', handleUserBtn);
  loginView.addHandlerModalBtns('signup', btnSignupHandler);
  loginView.addHandlerForm(loginHandler);
  loginView.addHandlerModalBackground();
};
