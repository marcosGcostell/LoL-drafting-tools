import appState from '../appState.js';
import LoginView from '../view/global/loginView.js';
import { validateAuthForm } from '../services/auth.js';
import { navigate } from '../utils/helpers.js';

let loginView;

const loginHandler = async e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const username = formData.get('username')?.trim();
  const password = formData.get('password');

  try {
    const errorMessage = await validateAuthForm({ username, password });
    if (errorMessage) {
      loginView.errorMessage = errorMessage;
      loginView.renderError();
      return;
    }

    const result = await appState.user.login(username, password);
    if (result.message) {
      loginView.errorMessage = result.message;
      loginView.renderError();
    }
  } catch (err) {
    loginView.errorMessage =
      'Something went wrong with the server. Could not log in';
    loginView.renderError();
  }
};

const signupHandler = () => {};

const close = () => {
  if (appState.lane) {
    appState.setCurrentPage(`${appState.appMode}`);
    navigate(`/${appState.appMode}`);
  } else {
    appState.setCurrentPage('starter');
    navigate('/');
  }
};

// Init funcion for loading the page
export default async () => {
  loginView = new LoginView();
  await loginView.initView();
  appState.setCurrentPage('login');

  loginView.addHandleBtn('close', close);
  loginView.addHandleBtn('signup', signupHandler);
  loginView.addHandlerForm(loginHandler);

  // appState.addEventListener('popup:login', toggleModal);
  // appState.addEventListener('popup:hideAll', hideModal);
  appState.addEventListener('user:login', e => {
    e.stopImmediatePropagation();
    appState.setCurrentPage(`${appState.appMode}`);
    navigate(`/${appState.appMode}`);
  });
};
