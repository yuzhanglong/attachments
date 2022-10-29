/**
 * 在页面即将销毁时做些什么
 *
 * @author yuzhanglong
 * @date 2021-11-10 00:44:39
 */
import { isFunction } from 'lodash';
import type { CallBack } from 'src/types';
import { getBrowserWindow } from './browser-interfaces';

export const onPageUnload = (callback: CallBack<Event>) => {
  const window = getBrowserWindow();
  if (!window || !isFunction(window.addEventListener))
    return;

  ['beforeunload', 'pagehide', 'unload'].forEach((event) => {
    window.addEventListener(event, (e) => {
      callback(e);
    });
  });
};
