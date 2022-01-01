import { getBrowserWindow, getDocument } from './browser-interfaces';

export const onPageLoad = (callback: () => void) => {
  const window = getBrowserWindow();
  const document = getDocument();
  if (!window || !document) {
    return;
  }

  if (document.readyState === 'complete') {
    callback();
    return;
  }

  window.addEventListener(
    'load',
    () => {
      setTimeout(() => {
        callback();
      }, 0);
    },
    false
  );
};
