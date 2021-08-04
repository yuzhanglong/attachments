import { GlobalIntl } from './types';

declare global {
  const intl: GlobalIntl;

  interface Window {
    intl: GlobalIntl
  }
}

export {};
