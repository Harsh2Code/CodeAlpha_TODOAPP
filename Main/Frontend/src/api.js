import { deployedBackendUrl, localBackendUrl } from './config';

export const getBackendUrl = async () => {
  // Use deployed backend URL since backend is deployed
  console.log('Using deployed backend URL');
  return deployedBackendUrl;
};
