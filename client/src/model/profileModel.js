export const getFormField = (form, target) => {
  const formData = new FormData(form);
  return formData.get(target)?.trim();
};

export const getPasswordFields = form => {
  const fields = ['oldPassword', 'password', 'passwordConfirm'];
  const formData = new FormData(form);
  const values = {};
  fields.forEach(field => {
    values[field] = formData.get(field)?.trim();
  });
  return values;
};

export const getChanges = (cache, user) => {
  const profile = ['name', 'username', 'email'];
  const config = Object.keys(cache.config);
  const data = Object.keys(cache.data).filter(key => key !== 'championPool');
  const championPool = Object.keys(cache.data.championPool);

  const changes = {};

  profile.forEach(el => {
    if (user[el] !== cache[el]) changes[el] = cache[el];
  });
  config.forEach(el => {
    if (user.config[el] !== cache.config[el]) {
      if (!changes.config) changes.config = {};
      changes.config[el] = cache.config[el];
    }
  });
  data.forEach(el => {
    if (user.data[el] !== cache.data[el]) {
      if (!changes.data) changes.data = {};
      changes.data[el] = cache.data[el];
    }
  });
  championPool.forEach(el => {
    let hasChange =
      user.data.championPool[el].length !== cache.data.championPool[el].length;
    if (!hasChange) {
      hasChange = user.data.championPool[el].reduce(
        (acc, champion, index) =>
          champion !== cache.data.championPool[el][index] || acc,
        false,
      );
    }

    if (hasChange) {
      if (!changes.data) changes.data = {};
      if (!changes.data.championPool) changes.data.championPool = {};
      changes.data.championPool[el] = cache.data.championPool[el];
    }
  });

  return changes;
};

export const hasBeenChanges = (cache, user) => {
  // structuredClone doesn't work with objects extending EventTarget
  const userCopy = JSON.parse(JSON.stringify(user));
  delete userCopy.isLoggedIn;
  delete userCopy.__type;

  return JSON.stringify(cache) !== JSON.stringify(userCopy);
};
