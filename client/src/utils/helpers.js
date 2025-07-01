import { TIME_BEFORE_UPDATE } from './config.js';

export const expirationDate = (hours = TIME_BEFORE_UPDATE) => {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
};
