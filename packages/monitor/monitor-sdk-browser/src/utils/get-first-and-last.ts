export const getFirstAndLast = <T>(arr: T[]) => {
  if (Array.isArray(arr) && arr.length > 0) {
    return [arr[0], arr[arr.length - 1]];
  }
  return [undefined, undefined];
};
