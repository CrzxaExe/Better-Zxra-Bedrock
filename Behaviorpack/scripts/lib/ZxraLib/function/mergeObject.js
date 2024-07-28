const mergeObject = (obj1, obj2) => {
  return Object.keys({ ...obj1, ...obj2 }).reduce((acc, key) => {
    acc[key] = obj2.hasOwnProperty(key) ? obj2[key] : obj1[key];
    return acc;
  }, {});
};

export { mergeObject };