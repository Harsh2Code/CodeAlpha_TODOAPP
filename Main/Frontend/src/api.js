import { deployedBackendUrl, localBackendUrl } from './config';

export const getBackendUrl = async () => {
  try {
    const response = await fetch(`${deployedBackendUrl}/api/health`);
    if (response.ok) {
      return deployedBackendUrl;
    }
  } catch (error) {
    // Deployed backend is not available, fall back to local
  }
  return localBackendUrl;
};
