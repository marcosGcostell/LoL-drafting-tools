export const navigate = path => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const wait = function (seconds) {
  return new Promise(response => {
    setTimeout(response, seconds * 1000);
  });
};

export const sortListAsc = (list, property) => {
  list.sort((a, b) => a[property] - b[property]);
};

export const sortListDesc = (list, property) => {
  list.sort((a, b) => b[property] - a[property]);
};
