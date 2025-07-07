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

export const getChanges = form => {
  const changes = {};
  const formData = new FormData(form);
  const fields = ['name', 'username', 'email', 'max-items', 'min-pr'];

  // fields.filter(field => )

  //   const valorForm = formData.get(campo)?.trim();
  //   // Solo comparar username y email con appState.user, el resto son para cambio de contraseña
  //   if (
  //     (campo === 'username' || campo === 'email') &&
  //     valorForm !== appState.user[campo]
  //   ) {
  //     cambios[campo] = valorForm;
  //   }
  //   // Para contraseñas, solo añadir si hay valor
  //   if (
  //     (campo === 'password' ||
  //       campo === 'new__password' ||
  //       campo === 'confirm__password') &&
  //     valorForm
  //   ) {
  //     cambios[campo] = valorForm;
  //   }
  // });

  // return cambios;
};
