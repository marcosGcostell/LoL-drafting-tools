import appState from '../../appState.js';
import * as profileModel from '../../model/profileModel.js';
import * as authService from '../../services/auth.js';
import UserDataView from '../../view/profile/userDataView.js';

let userDataView;

export const togglePanel = () => {
  if (!appState.popUpOn || appState.popUpOn === 'password') {
    userDataView.togglePanel();
    appState.popUpOn = userDataView.isPanelShowed ? 'password' : '';
    if (userDataView.isPanelShowed) userDataView.showPasswordMsg('');
  }
};

const listItemsHandler = value => {
  const parsedValue = parseInt(value);
  if (parsedValue) {
    appState.setSetting('maxListItems', parsedValue);
  }
  // Need to set again the value to display correct format
  userDataView.setMaxItems(appState.maxListItems);
};

const pickRateHandler = value => {
  const parsedValue = parseFloat(value);
  if (parsedValue) {
    appState.setSetting('pickRateThreshold', parsedValue);
  }
  // Need to set again the value to display correct format
  userDataView.setPickRateThreshold(appState.pickRateThreshold);
};

const savePassword = async () => {
  const { password, new__password, confirm__password } =
    profileModel.getPasswordFields(userDataView.form);

  const result = await authService.validatePassword(
    {
      oldPassword: password,
      password: new__password,
      confirmPassword: confirm__password,
    },
    { length: true, confirm: true, userName: appState.user.userName },
  );

  if (!result?.token) {
    userDataView.showPasswordMsg(result);
    return;
  }

  if (
    !(await appState.user.updateUser({
      password: new__password,
      passwordConfirm: confirm__password,
    }))
  ) {
    userDataView.showPasswordMsg(appState.user.response);
  }

  appState.userUpdated();
  userDataView.showPasswordMsg('Password changed successfully.');
  userDataView.togglePanel();
};

const checkUserData = async target => {
  const field = profileModel.getFormField(userDataView.form, target);

  let message = null;
  if (target === 'username') {
    message = await authService.validateUsername(field, true);
  } else if (target === 'email') {
    message = await authService.validateEmail(field, true);
  } else return;

  const fieldIsChanged =
    (target === 'username' &&
      field.toLowerCase() !== appState.user.userName.toLowerCase()) ||
    (target === 'email' &&
      field.toLowerCase() !== appState.user.email.toLowerCase());
  if (message && fieldIsChanged) {
    userDataView.showUserMsg(message);
    return;
  }

  userDataView.resetUserMsg();
  userDataView.changeCheckBtn(target);
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
      'Pleae, check your username or email before saving the data',
    );
    return true;
  }
  return false;
};

export const getFormChanges = () => {
  return profileModel.getChanges(userDataView.form, appState.user);
};

export const init = async () => {
  // Set user data in the form
  userDataView = new UserDataView();
  userDataView.initView(appState.user);
  // Load champion pool

  // Set handlers for the profile view
  // Fix Buttons
  userDataView.addHandlerBtn('password', togglePanel);
  userDataView.addHandlerBtn('password__save', savePassword);
  // Disabled buttons
  ['username', 'email'].forEach(id => {
    userDataView.addHandlerInput(id, activateInputBtn);
  });
  // Settings inputs changes
  userDataView.addHandlerCommit('max-items', listItemsHandler);
  userDataView.addHandlerCommit('min-pr', pickRateHandler);
};
