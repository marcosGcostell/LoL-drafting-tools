export const getFormField = (form, target) => {
  const formData = new FormData(form);
  return formData.get(target)?.trim();
};

export const getPasswordFields = form => {
  const fields = ['password', 'new__password', 'confirm__password'];
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
    if (user.config[el] !== cache.config[el])
      changes.config[el] = cache.config[el];
  });
  data.forEach(el => {
    if (user.data[el] !== cache.data[el]) changes.data[el] = cache.data[el];
  });
  championPool.forEach(el => {
    if (user.data.championPool[el] !== cache.data.championPool[el])
      changes.data.championPool[el] = cache.data.championPool[el];
  });

  return changes;
};

export const hasBeenChanges = (cache, user) => {
  // structuredClone doesn't work with objects extending EventTarget
  const userCopy = JSON.parse(JSON.stringify(user));
  delete userCopy.token;
  delete userCopy.response;
  delete userCopy.__type;

  return JSON.stringify(cache) !== JSON.stringify(userCopy);
};
