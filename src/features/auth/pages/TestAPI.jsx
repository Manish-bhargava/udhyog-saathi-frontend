import React, { useEffect } from 'react';
import axios from 'axios';

const TestAPI = () => {
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API connection to actual endpoints...');
        
        // Test 1: Check if server is reachable
        console.log('Test 1: Checking server connectivity...');
        const baseResponse = await axios.get('http://localhost:3000', { timeout: 3000 });
        console.log('Server is reachable:', baseResponse.status);
        
        // Test 2: Try the actual login endpoint (GET to see if it exists)
        console.log('\nTest 2: Checking /api/v1/auth/login endpoint...');
        try {
          // Try a GET request to see if endpoint exists (might get 404 or 405)
          const loginResponse = await axios.get('http://localhost:3000/api/v1/auth/login', { timeout: 3000 });
          console.log('Login endpoint GET response:', loginResponse.status);
        } catch (err) {
          if (err.response?.status === 405) {
            console.log('Login endpoint exists (Method Not Allowed for GET - POST expected)');
          } else {
            console.log('Login endpoint check:', err.message);
          }
        }
        
        // Test 3: Check the actual API base
        console.log('\nTest 3: Checking API base URL...');
        try {
          const apiResponse = await axios.get('http://localhost:3000/api/v1', { timeout: 3000 });
          console.log('API base response:', apiResponse.status);
        } catch (err) {
          console.log('API base check:', err.response?.status || err.message);
        }
        
        // Test 4: Test CORS by making a POST request
        console.log('\nTest 4: Testing POST to login endpoint...');
        const testCredentials = {
          email: 'test@example.com',
          password: 'password123'
        };
        
        try {
          const postResponse = await axios.post('http://localhost:3000/api/v1/auth/login', testCredentials, {
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('POST to login endpoint:', postResponse.status);
          console.log('Response:', postResponse.data);
        } catch (err) {
          console.log('POST test result:');
          console.log('- Status:', err.response?.status);
          console.log('- Message:', err.response?.data?.message || err.message);
          console.log('- CORS Error?', err.message.includes('CORS') ? 'Yes' : 'No');
        }
        
      } catch (error) {
        console.error('API test failed:', error);
        console.log('\nTroubleshooting:');
        console.log('1. Is your backend server running? Check: http://localhost:3000');
        console.log('2. Check backend logs for errors');
        console.log('3. Ensure CORS is enabled in backend');
        console.log('4. Check if the endpoint is /api/v1/auth/login (not /auth/test)');
      }
    };
    
    testAPI();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">API Connection Test</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <p className="mb-4">Check the browser console for detailed test results.</p>
          <p className="text-sm text-gray-600 mb-2">Press F12 → Console tab to see logs</p>
          <p className="text-sm text-gray-600 mb-4">Also check Network tab for HTTP requests</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">Important Notes:</h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Backend server should be running at http://localhost:3000</li>
              <li>API base URL should be http://localhost:3000/api/v1</li>
              <li>Login endpoint should be POST /api/v1/auth/login</li>
              <li>Check backend CORS configuration</li>
            </ul>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-bold text-yellow-800 mb-3">Common Issues</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>Backend not running on port 3000</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>Wrong API endpoint path</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>CORS not configured in backend</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span>Database connection issues</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-800 mb-3">Quick Checks</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="http://localhost:3000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-900 underline"
                >
                  Check backend server
                </a>
              </li>
              <li>
                <a 
                  href="http://localhost:3000/api/v1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-900 underline"
                >
                  Check API base
                </a>
              </li>
              <li>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Run Tests Again
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;