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
  const fields = ['name', 'username', 'email', 'max-items', 'min-pr'];

  const config = {};
  ['max-items', 'min-pr'].forEach(option => {
    const formValue = +formData.get(option)?.trim();
    if (formValue !== user.config[option]) {
      config[option] = formValue;
    }
  });

  const userChanges = {};
  if (Object.keys(config).length) userChanges.config = config;
  ['name', 'username', 'email'].forEach(option => {
    const formValue = formData.get(option)?.trim();
    if (formValue !== user[option]) {
      userChanges[option] = formValue;
    }
  });

  return userChanges;
};
