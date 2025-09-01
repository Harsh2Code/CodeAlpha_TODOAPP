import { deployedBackendUrl, localBackendUrl } from './config';

export const getBackendUrl = async () => {
  // First try deployed backend
  try {
    console.log('Checking deployed backend health...');
    const response = await fetch(`${deployedBackendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(3000)
    });

    if (response.ok) {
      const healthData = await response.json();
      console.log('Deployed backend is healthy:', healthData);
      return deployedBackendUrl;
    } else {
      console.warn('Deployed backend responded with status:', response.status);
      // Try alternative health endpoint
      try {
        const altResponse = await fetch(`${deployedBackendUrl}/api/auth/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(3000)
        });
        if (altResponse.ok) {
          console.log('Deployed backend alternative health check passed');
          return deployedBackendUrl;
        }
      } catch (altError) {
        console.warn('Alternative health check also failed');
      }
    }
  } catch (error) {
    console.warn('Deployed backend health check failed:', error.message);
  }

  // Check if local backend is available
  try {
    console.log('Checking local backend...');
    const localResponse = await fetch(`${localBackendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(2000)
    });

    if (localResponse.ok) {
      console.log('Local backend is available');
      return localBackendUrl;
    }
  } catch (error) {
    console.error('Local backend is also unavailable:', error.message);
  }

  // As a fallback, return deployed URL - some endpoints might still work
  console.warn('Using deployed backend as fallback');
  return deployedBackendUrl;
};
