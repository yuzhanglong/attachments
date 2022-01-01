export const instanceOf = (a: any, b: any) => {
  if (b) {
    return a instanceof b;
  }
  return false;
};
