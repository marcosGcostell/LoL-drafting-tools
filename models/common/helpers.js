import { TIME_BEFORE_CHECK, USER_AGENTS } from './config.js';

export const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

export const wait = function (seconds) {
  return new Promise(response => {
    setTimeout(response, seconds * 1000);
  });
};

export const waitMs = function (miliseconds) {
  return new Promise(response => {
    setTimeout(response, miliseconds);
  });
};

export const expirationDate = () => {
  return new Date(
    Date.now() - TIME_BEFORE_CHECK * 60 * 60 * 1000
  ).toISOString();
};

export const findAsObject = async function () {
  const docs = await this.find();
  return docs.reduce((acc, doc) => {
    acc[doc.id] = doc;
    return acc;
  }, {});
};

export const getRandomUserAgent = () => {
  return USER_AGENTS[Math.floor(getRandomNumber(0, USER_AGENTS.length))];
};
