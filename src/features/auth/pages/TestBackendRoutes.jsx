import React, { useState } from 'react';
import { authAPI } from '../api/index.js';

const TestBackendRoutes = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint, method = 'GET', data = null) => {
    setLoading(true);
    try {
      let response;
      const apiInstance = authAPI.api || window.api;
      
      if (method === 'GET') {
        response = await apiInstance.get(endpoint);
      } else {
        response = await apiInstance.post(endpoint, data);
      }
      setResults(prev => ({
        ...prev,
        [endpoint]: { success: true, data: response.data }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint]: { 
          success: false, 
          error: error.message,
          status: error.response?.status,
          data: error.response?.data
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    // Clear previous results
    setResults({});
    
    // Test auth endpoint
    await testEndpoint('/auth/test', 'GET');
    
    // Test onboarding endpoint with GET first
    await testEndpoint('/user/onboarding', 'GET');
    
    // Then test with POST
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    await testEndpoint('/user/onboarding', 'POST', {
      companyName: 'Test Company',
      companyEmail: 'test@test.com',
      GST: 'TEST123',
      userId: user._id
    });
  };

  const testOnboardingWithAuthAPI = async () => {
    setLoading(true);
    try {
      const result = await authAPI.testOnboardingEndpoint();
      setResults(prev => ({
        ...prev,
        'authAPI.onboarding': result.success 
          ? { success: true, data: result }
          : { success: false, error: result.message, status: result.status }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        'authAPI.onboarding': { 
          success: false, 
          error: error.message
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Backend Route Tester</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <p><strong>Current User:</strong> {JSON.parse(localStorage.getItem('user') || '{}').email || 'No user logged in'}</p>
        <p><strong>User ID:</strong> {JSON.parse(localStorage.getItem('user') || '{}')._id || 'No user ID'}</p>
        <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={testAllEndpoints} 
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Testing...' : 'Test All Endpoints'}
        </button>
        
        <button 
          onClick={testOnboardingWithAuthAPI}
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Test Onboarding API
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Results:</h3>
        {Object.entries(results).map(([endpoint, result]) => (
          <div key={endpoint} style={{ 
            margin: '10px 0', 
            padding: '10px', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: result.success ? '#d4edda' : '#f8d7da'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {endpoint}: {result.success ? '✅ Success' : '❌ Failed'}
            </div>
            {result.error && <div style={{ color: '#721c24' }}>Error: {result.error}</div>}
            {result.status && <div>Status: {result.status}</div>}
            {result.data && (
              <div style={{ marginTop: '5px' }}>
                <div>Data:</div>
                <pre style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestBackendRoutes;