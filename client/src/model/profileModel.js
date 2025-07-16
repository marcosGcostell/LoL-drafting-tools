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

export const getChanges = (form, user) => {
  const changes = {};
  const formData = new FormData(form);
  const settigns = [
    ['max-items', 'maxListItems'],
    ['min-pr', 'pickRateThreshold'],
  ];
  const options = ['name', 'username', 'email'];

  const config = {};
  settigns.forEach(([formId, userId]) => {
    const formValue = +formData.get(formId);
    if (formValue !== user.config[userId]) {
      config[userId] = formValue;
    }
  });

  const userChanges = {};
  if (Object.keys(config).length) userChanges.config = config;
  options.forEach(id => {
    const formValue = formData.get(id)?.trim();
    if (formValue !== user[id]) {
      userChanges[id] = formValue;
    }
  });

  return userChanges;
};
