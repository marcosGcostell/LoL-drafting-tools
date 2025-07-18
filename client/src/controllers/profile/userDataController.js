import appState from '../../appState.js';
import * as profileModel from '../../model/profileModel.js';
import * as authService from '../../services/auth.js';
import UserDataView from '../../view/profile/userDataView.js';

let userDataView;
let userCache;

// BUG When an input is submit, it shouldn't open password popup

const hidePopUps = e => {
  const exclude = e.detail?.exclude || null;
  if (!userDataView.isPanelShowed || exclude === 'password') return;

  userDataView.togglePanel();
  appState.popUpOn = exclude || '';
};

const togglePanel = () => {
  if (!appState.popUpOn || appState.popUpOn === 'password') {
    userDataView.togglePanel();
    appState.popUpOn = userDataView.isPanelShowed ? 'password' : '';
    if (userDataView.isPanelShowed) userDataView.showPasswordMsg('');
  }
};

const listItemsHandler = (_, value) => {
  const parsedValue = parseInt(value, 10);
  if (parsedValue) {
    userCache.setConfig({ maxListItems: parsedValue });
  }
  // Need to set again the value to display correct format
  userDataView.setMaxItems(appState.maxListItems);
};

const pickRateHandler = (_, value) => {
  const parsedValue = parseFloat(value);
  if (parsedValue) {
    userCache.setConfig({ pickRateThreshold: parsedValue });
  }
  // Need to set again the value to display correct format
  userDataView.setPickRateThreshold(appState.pickRateThreshold);
};

const inputsHandler = (target, value) => {
  if (target !== 'name' && userDataView.isActive[target]) return;

  const data = {};
  data[target] = value;
  userCache.setProfile(data);
};

const savePassword = async () => {
  try {
    const { password, newPassword, passwordConfirm } =
      profileModel.getPasswordFields(userDataView.passwordForm);

    const result = await authService.validatePassword(
      {
        oldPassword: password,
        password: newPassword,
        passwordConfirm,
      },
      { length: true, confirm: true, username: appState.user.username },
    );

    if (!result?.token) {
      userDataView.showPasswordMsg(result);
      return;
    }

    const user = await appState.user.updateUser({
      password: newPassword,
      passwordConfirm,
    });

    if (user.message) {
      userDataView.showPasswordMsg(user.message);
      return;
    }

    appState.userUpdated();
    userDataView.showPasswordMsg('Password changed successfully.');
    userDataView.togglePanel();
  } catch (err) {
    console.error(err);
    userDataView.showPasswordMsg(
      'Something went wrong with the server. Password could have not be changed',
    );
  }
};

const checkUserData = async target => {
  const field = profileModel.getFormField(userDataView.form, target);

  try {
    let message = null;
    if (target === 'username') {
      message = await authService.validateUsername(field, true);
    } else if (target === 'email') {
      message = await authService.validateEmail(field, true);
    } else return;

    const fieldIsChanged =
      (target === 'username' &&
        field.toLowerCase() !== appState.user.username.toLowerCase()) ||
      (target === 'email' &&
        field.toLowerCase() !== appState.user.email.toLowerCase());
    if (message && fieldIsChanged) {
      userDataView.showUserMsg(message);
      return;
    }

    userDataView.resetUserMsg();
    userDataView.changeCheckBtn(target);
  } catch (err) {
    userDataView.showUserMsg(
      'Something went wrong with the server. Could not access to check for existing users or emails',
    );
  }
};

const activateInputBtn = target => {
  userDataView.changeCheckBtn(target, checkUserData.bind(null, target));
};

export const isFormActive = () => {
  if (
    appState.popUpOn ||
    userDataView.isActive.username ||
    userDataView.isActive.email
  ) {
    userDataView.showUserMsg(
      'Please, check your username or email before saving the data',
    );
    return true;
  }
  return false;
};

export const initUserData = async data => {
  // Set user data in the form
  userCache = data;
  userDataView = new UserDataView();
  userDataView.initView(userCache);

  // Set handlers for the profile view
  // Fix Buttons
  userDataView.addHandlerBtn('password', togglePanel);
  userDataView.addHandlerBtn('password__save', savePassword);
  // Disabled buttons
  ['username', 'email'].forEach(id => {
    userDataView.addHandlerInput(id, activateInputBtn);
    userDataView.addHandlerCommit(id, inputsHandler);
  });
  // Settings rest of inputs changes
  userDataView.addHandlerCommit('max-items', listItemsHandler);
  userDataView.addHandlerCommit('min-pr', pickRateHandler);
  userDataView.addHandlerCommit('name', inputsHandler);

  appState.addEventListener('popup:hideAll', hidePopUps);
};
