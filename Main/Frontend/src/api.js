import { deployedBackendUrl, localBackendUrl } from './config';

export const getBackendUrl = async () => {
  try {
    // Create a timeout promise to avoid hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Health check timeout')), 5000);
    });

    // Create the health check request
    const healthCheckPromise = fetch(`${deployedBackendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Race between the health check and timeout
    const response = await Promise.race([healthCheckPromise, timeoutPromise]);
    
    if (response.ok) {
      const healthData = await response.json();
      console.log('Deployed backend is healthy:', healthData);
      return deployedBackendUrl;
    } else {
      console.warn('Deployed backend responded with non-OK status:', response.status);
    }
  } catch (error) {
    console.warn('Deployed backend health check failed:', error.message);
    // Fall back to local backend
  }
  
  // Check if local backend is available
  try {
    const localResponse = await fetch(`${localBackendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (localResponse.ok) {
      console.log('Local backend is available');
      return localBackendUrl;
    }
  } catch (error) {
    console.error('Both deployed and local backends are unavailable:', error.message);
    // As a last resort, return deployed URL which might work in some cases
    return deployedBackendUrl;
  }
  
  return localBackendUrl;
};
