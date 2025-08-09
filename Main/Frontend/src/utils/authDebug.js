// Utility to debug authentication issues
export const debugAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('=== AUTH DEBUG INFO ===');
    console.log('Token exists:', !!token);
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('User role:', user.role);
    console.log('User ID:', user.id);
    
    return {
        hasToken: !!token,
        role: user.role,
        userId: user.id
    };
};

// Test API call with detailed error logging
export const testAuthEndpoint = async (endpoint) => {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`=== ${endpoint} TEST ===`);
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error Response:', errorText);
        }
        
        return response;
    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
};
