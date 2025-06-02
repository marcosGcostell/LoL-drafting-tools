import { TIME_BEFORE_CHECK } from './config.js';

export const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

export const wait = function (seconds) {
  return new Promise(response => {
    setTimeout(response, seconds * 1000);
  });
};

export const hasLocalVersionExpired = createdAt => {
  // Check version last updated timestamp
  const timeElapsed = (Date.now() - Date.parse(createdAt)) / (3600 * 1000);
  console.log(`Time elasped since last backup: ${timeElapsed}`);
  return timeElapsed > TIME_BEFORE_CHECK;
};
