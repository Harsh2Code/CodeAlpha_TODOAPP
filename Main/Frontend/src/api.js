import { deployedBackendUrl, localBackendUrl } from './config';

export const getBackendUrl = async () => {
  // Use local backend URL for development
  console.log('Using local backend URL');
  return localBackendUrl;
};
