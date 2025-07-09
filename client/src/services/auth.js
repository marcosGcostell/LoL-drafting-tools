import { checkUserFromAPI, loginOnAPI } from './apiCalls.js';
import { PASSWORD_MIN_LENGTH } from '../../../models/utils/config.js';

export const validateEmail = async (email, checkOnApi = false) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please, provide a valid email.';
  }
  if (!checkOnApi) return null;

  const message = await checkUserFromAPI({ email });
  if (message) return message;

  return null;
};

export const validateUsername = async (userName, checkOnApi = false) => {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  if (!usernameRegex.test(userName)) {
    return 'User name should start with a letter and use only letters, numbers or underscore(_)';
  }
  if (!checkOnApi) return null;

  const message = await checkUserFromAPI({ userName });
  if (message) return message;

  return null;
};

const checkUserPassword = async (userName, password) => {
  try {
    const { token } = await loginOnAPI(userName, password);

    return token ? { token } : 'Current password is incorrect.';
  } catch (err) {
    return 'Current password is incorrect.';
  }
};

export const validatePassword = async (
  { oldPassword, password, confirmPassword },
  { length = true, confirm = false, userName = '' } = { length: true }
) => {
  if (length && password.length < PASSWORD_MIN_LENGTH) {
    return `Password should be at least ${PASSWORD_MIN_LENGTH} chars long.`;
  }
  if (confirm && !confirmPassword) {
    return 'Please, confirm your password.';
  }
  if (confirm && confirmPassword !== password) {
    return 'Passwords are not the same.';
  }
  if (userName && !oldPassword) {
    return 'Please, provide your current password.';
  }
  // Check if current password is correct with API call
  if (userName && oldPassword) {
    return await checkUserPassword(userName, oldPassword);
  }
  return null;
};

export const validateAuthForm = async (fields, isSignup = false) => {
  const { userName, password, email, confirmPassword, termsAccepted } = fields;
  let message = null;

  if (!userName || !userName.trim() || !password) {
    return 'Please, provide an username or email and a password.';
  }

  message = await validatePassword({ password }, { length: true });
  if (message) return message;

  // Signup validators

  if (isSignup) {
    message = await validateUsername(userName);
    if (message) return message;

    message = await validateEmail(email);
    if (message) return message;

    message = await validatePassword(
      { password, confirmPassword },
      { length: false, confirm: true }
    );
    if (message) return message;

    if (!termsAccepted) {
      return 'Please, read and accept terms and conditions.';
    }
  }

  return null;
};
