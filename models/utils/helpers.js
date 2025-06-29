import { TIME_BEFORE_UPDATE, USER_AGENTS } from './config.js';

export const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

export const getRandomInt = (min, max) =>
  Math.floor(getRandomNumber(min, max + 1));

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

export const isoTimeStamp = () => new Date().toISOString();

export const getRandomUserAgent = () => {
  return USER_AGENTS[getRandomInt(0, USER_AGENTS.length - 1)];
};

export const expirationDate = (hours = TIME_BEFORE_UPDATE) => {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
};

export const findAsObject = async function () {
  const docs = await this.find();
  return docs.reduce((acc, doc) => {
    acc[doc.id] = doc;
    return acc;
  }, {});
};

export function escapeRegex(str) {
  if (typeof str !== 'string' || !str.trim()) return null;
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
