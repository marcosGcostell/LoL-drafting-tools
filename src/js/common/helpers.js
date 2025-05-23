export const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

export const wait = function (seconds) {
  return new Promise(function (response) {
    setTimeout(response, seconds * 1000);
  });
};
