export const shuffleObjects = (obj, num) => {
  return obj.sort(() => 0.5 - Math.random()).slice(0, num);
};
