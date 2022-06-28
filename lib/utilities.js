export const selectFromFields = (fields) => {
  return fields.reduce((result, item) => {
    result[item] = 1;
    return result;
  }, {});
};
