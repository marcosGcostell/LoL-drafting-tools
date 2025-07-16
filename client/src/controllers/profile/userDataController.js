import appState from '../../appState.js';
import * as profileModel from '../../model/profileModel.js';
import * as authService from '../../services/auth.js';
import UserDataView from '../../view/profile/userDataView.js';

let userDataView;
let userCache;

export const hidePopUps = (exclude = null) => {
  if (!userDataView.isPanelShowed || exclude === 'password') return;

  userDataView.togglePanel();
};

export const togglePanel = () => {
  if (!appState.popUpOn || appState.popUpOn === 'password') {
    userDataView.togglePanel();
    appState.popUpOn = userDataView.isPanelShowed ? 'password' : '';
    if (userDataView.isPanelShowed) userDataView.showPasswordMsg('');
  }
};

const listItemsHandler = (_, value) => {
  const parsedValue = parseInt(value);
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
  const { password, new__password, confirm__password } =
    profileModel.getPasswordFields(userDataView.form);

  const result = await authService.validatePassword(
    {
      oldPassword: password,
      password: new__password,
      confirmPassword: confirm__password,
    },
    { length: true, confirm: true, username: appState.user.username },
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
      field.toLowerCase() !== appState.user.username.toLowerCase()) ||
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
      'Please, check your username or email before saving the data',
    );
    return true;
  }
  return false;
};

export const getFormChanges = () => {
  return profileModel.getChanges(userDataView.form, appState.user);
};

export const init = async data => {
  // Set user data in the form
  userCache = data;
  userDataView = new UserDataView();
  userDataView.initView(userCache);
  // Load champion pool

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
};
