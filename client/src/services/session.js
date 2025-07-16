import Patch from '../model/patchModel.js';
import user from '../model/userModel.js';

const classList = {
  Patch,
  user,
};

// eslint-disable-next-line import/prefer-default-export
export function reviver(_, value) {
  if (value?.__type && classList[value.__type]?.fromJSON) {
    return classList[value.__type].fromJSON(value);
  }
  return value;
}
