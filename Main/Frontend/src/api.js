import { deployedBackendUrl, localBackendUrl } from './config';

export const getBackendUrl = async () => {
  // Directly return deployed backend URL since health checks are failing
  console.log('Using deployed backend URL');
  return deployedBackendUrl;
};
