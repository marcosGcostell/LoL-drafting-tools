import { TIME_BEFORE_UPDATE } from './config.js';

export const expirationDate = (hours = TIME_BEFORE_UPDATE) => {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
};

export const sortListAsc = (list, property) => {
  list.sort((a, b) => a[property] - b[property]);
};

export const sortListDesc = (list, property) => {
  list.sort((a, b) => b[property] - a[property]);
};

export const wait = function (seconds) {
  return new Promise(response => {
    setTimeout(response, seconds * 1000);
  });
};
