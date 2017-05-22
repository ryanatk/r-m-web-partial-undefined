/* eslint import/prefer-default-export: 0 */
import S from 'string';

const createDataPair = (key, value) => {
  const attr = S(key).dasherize().s;
  const attrVal = JSON.stringify(value);
  return `data-${attr}=${attrVal}`;
};

export const createDataAttrsFromObj = obj =>
  Object.keys(obj)
    .map(name => createDataPair(name, obj[name]))
    .join(' ');

