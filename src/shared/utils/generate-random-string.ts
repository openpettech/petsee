export const generateRandomString = (length = 32) => {
  return Math.random().toString(20).substring(2, length);
};
