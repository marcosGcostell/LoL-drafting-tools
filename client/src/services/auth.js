import { PASSWORD_MIN_LENGTH } from '../../../models/utils/config.js';

export const validateAuthForm = (fields, isSignup = false) => {
  const { userName, password, email, confirmPassword, termsAccepted } = fields;

  if (!userName || !userName.trim() || !password) {
    return 'Please, provide an username or email and a password.';
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password should be at least ${PASSWORD_MIN_LENGTH} chars long.`;
  }

  // Signup validators

  if (isSignup) {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!usernameRegex.test(userName)) {
      return 'User name should start with a letter and use only letters, numbers or underscore(_)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return 'Please, provide a valid email.';
    }

    if (!confirmPassword) {
      return 'Please, confirm your password.';
    }

    if (confirmPassword !== password) {
      return 'Passwords are not the same.';
    }

    if (!termsAccepted) {
      return 'Please, read and accept terms and conditions.';
    }
  }

  return null;
};
