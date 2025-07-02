import Patch from '../model/patchModel.js';
import User from '../model/userModel.js';

const classList = {
  Patch,
  User,
};

export function reviver(_, value) {
  if (value?.__type && classList[value.__type]?.fromJSON) {
    return classList[value.__type].fromJSON(value);
  }
  return value;
}
