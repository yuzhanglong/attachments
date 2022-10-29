import { isFunction, isObject } from 'lodash';

export const getBrowserWindow = () => {
  if (isObject(window))
    return window;

  return null;
};

export const getPerformance = () => {
  if (getBrowserWindow() && isObject(window.performance))
    return window.performance;

  return null;
};

export const getPerformanceObserver = () => {
  if (getBrowserWindow() && isFunction(window.PerformanceObserver))
    return window.PerformanceObserver;

  return null;
};

export const getXMLHttpRequest = () => {
  if (getBrowserWindow() && isFunction(window.XMLHttpRequest))
    return window.XMLHttpRequest;

  return null;
};

export const getDocument = () => {
  const window = getBrowserWindow();
  if (!window || !window.document)
    return null;

  return window.document;
};

export const getAnimationFrame = () => {
  const window = getBrowserWindow();

  if (!window)
    return null;

  return {
    raf: window.requestAnimationFrame,
    caf: window.cancelAnimationFrame,
  };
};

export const getMutationObserver = () => {
  const window = getBrowserWindow();

  if (!window)
    return undefined;

  return window.MutationObserver;
};
