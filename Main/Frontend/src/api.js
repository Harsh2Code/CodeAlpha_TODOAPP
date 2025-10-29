import { deployedBackendUrl, localBackendUrl } from './config';

export const getBackendUrl = async () => {
  if (import.meta.env.DEV) {
    console.log('Using local backend URL');
    return localBackendUrl;
  } else {
    console.log('Using deployed backend URL');
    return deployedBackendUrl;
  }
};
