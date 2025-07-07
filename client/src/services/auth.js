import { PASSWORD_MIN_LENGTH } from '../../../models/utils/config.js';

export const validateEmail = (email, checkOnApi = false) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please, provide a valid email.';
  }
  if (!checkOnApi) return null;

  // Check on API
  return null;
};

export const validateUsername = (userName, checkOnApi = false) => {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  if (!usernameRegex.test(userName)) {
    return 'User name should start with a letter and use only letters, numbers or underscore(_)';
  }
  if (!checkOnApi) return null;

  // Check on API
  return null;
};

export const validatePassword = (
  { oldPassword, password, confirmPassword },
  { length = true, confirm = false, change = false } = { length: true }
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
  if (change && !oldPassword) {
    return 'Please, provide your current password.';
  }
  // Check on API
  return null;
};

export const validateAuthForm = (fields, isSignup = false) => {
  const { userName, password, email, confirmPassword, termsAccepted } = fields;
  let message = null;

  if (!userName || !userName.trim() || !password) {
    return 'Please, provide an username or email and a password.';
  }

  message = validatePassword({ password }, { length: true });
  if (message) return message;

  // Signup validators

  if (isSignup) {
    message = validateUsername(userName);
    if (message) return message;

    message = validateEmail(email);
    if (message) return message;

    message = validatePassword(
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
