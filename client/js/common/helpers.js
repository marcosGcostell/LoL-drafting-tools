import { TIME_BEFORE_UPDATE } from './config.js';

export const expirationDate = () => {
  return new Date(
    Date.now() - TIME_BEFORE_UPDATE * 60 * 60 * 1000
  ).toISOString();
};
