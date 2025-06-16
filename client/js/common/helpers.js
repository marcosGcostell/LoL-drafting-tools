import { TIME_BEFORE_CHECK } from './config.js';

export const expirationDate = () => {
  return new Date(
    Date.now() - TIME_BEFORE_CHECK * 60 * 60 * 1000
  ).toISOString();
};
