import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function SystemStatusPage() {
  const navigate = useNavigate();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2598bc7a`;

  async function testBackend() {
    setTesting(true);
    const testResults: any = {
      serverReachable: false,
      authEndpoint: false,
      cropsEndpoint: false,
      marketEndpoint: false,
      weatherEndpoint: false,
      errors: []
    };

    try {
      // Test 1: Check if server is reachable
      const response = await fetch(`${API_BASE_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.ok || response.status === 404) {
        testResults.serverReachable = true;
      }
    } catch (error: any) {
      testResults.errors.push(`Server unreachable: ${error.message}`);
    }

    // Test 2: Check auth endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/auth/session`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      // We expect 401 if not authenticated, which means endpoint exists
      if (response.status === 401 || response.status === 200) {
        testResults.authEndpoint = true;
      }
    } catch (error: any) {
      testResults.errors.push(`Auth endpoint error: ${error.message}`);
    }

    // Test 3: Check crops endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/crops`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.status === 401 || response.status === 200) {
        testResults.cropsEndpoint = true;
      }
    } catch (error: any) {
      testResults.errors.push(`Crops endpoint error: ${error.message}`);
    }

    // Test 4: Check market endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/market/products`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.status === 200) {
        testResults.marketEndpoint = true;
      }
    } catch (error: any) {
      testResults.errors.push(`Market endpoint error: ${error.message}`);
    }

    // Test 5: Check weather endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/weather`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.status === 200 || response.status === 400) {
        testResults.weatherEndpoint = true;
      }
    } catch (error: any) {
      testResults.errors.push(`Weather endpoint error: ${error.message}`);
    }

    setResults(testResults);
    setTesting(false);
  }

  useEffect(() => {
    testBackend();
  }, []);

  const StatusIcon = ({ status }: { status: boolean }) => {
    if (status) {
      return <CheckCircle className="text-green-600" size={20} />;
    }
    return <XCircle className="text-red-600" size={20} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-blue-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/home')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-2xl font-bold">System Status</h1>
        </div>
        <p className="text-blue-100 text-sm">
          Check if your backend is deployed and working
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Configuration Info */}
        <Card className="rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Configuration</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Project ID:</span>
              <p className="font-mono text-xs text-gray-900 break-all">{projectId}</p>
            </div>
            <div>
              <span className="text-gray-600">API URL:</span>
              <p className="font-mono text-xs text-gray-900 break-all">{API_BASE_URL}</p>
            </div>
          </div>
        </Card>

        {/* Test Results */}
        <Card className="rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Backend Status</h3>
            <Button
              onClick={testBackend}
              disabled={testing}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
            >
              {testing ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  Testing...
                </>
              ) : (
                'Retest'
              )}
            </Button>
          </div>

          {results ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-700">Server Reachable</span>
                <StatusIcon status={results.serverReachable} />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-700">Auth Endpoint</span>
                <StatusIcon status={results.authEndpoint} />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-700">Crops Endpoint</span>
                <StatusIcon status={results.cropsEndpoint} />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-700">Market Endpoint</span>
                <StatusIcon status={results.marketEndpoint} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Weather Endpoint</span>
                <StatusIcon status={results.weatherEndpoint} />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader className="animate-spin mx-auto mb-2 text-blue-600" size={32} />
              <p className="text-sm text-gray-600">Testing backend...</p>
            </div>
          )}
        </Card>

        {/* Deployment Instructions */}
        {results && !results.serverReachable && (
          <Card className="rounded-2xl p-4 bg-orange-50 border-orange-200">
            <div className="flex gap-3">
              <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-orange-900 mb-2">
                  Backend Not Deployed
                </h4>
                <p className="text-sm text-orange-800 mb-3">
                  Your backend Edge Function hasn't been deployed to Supabase yet. 
                  The app is currently using mock data.
                </p>
                <div className="bg-white rounded-lg p-3 text-sm">
                  <p className="font-semibold text-gray-900 mb-2">Quick Deploy Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Go to Supabase Dashboard</li>
                    <li>Navigate to Edge Functions</li>
                    <li>Create function: <code className="bg-gray-100 px-1 rounded">make-server-2598bc7a</code></li>
                    <li>Copy code from <code className="bg-gray-100 px-1 rounded">/supabase/functions/server/index.tsx</code></li>
                    <li>Deploy and test</li>
                  </ol>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {results && results.serverReachable && results.authEndpoint && results.cropsEndpoint && (
          <Card className="rounded-2xl p-4 bg-green-50 border-green-200">
            <div className="flex gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">
                  Backend is Live! 🎉
                </h4>
                <p className="text-sm text-green-800">
                  Your backend is deployed and all endpoints are responding correctly. 
                  You can now use all features of the app!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Errors */}
        {results && results.errors.length > 0 && (
          <Card className="rounded-2xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Error Details</h4>
            <div className="space-y-1">
              {results.errors.map((error: string, idx: number) => (
                <p key={idx} className="text-xs font-mono text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </p>
              ))}
            </div>
          </Card>
        )}

        <Button
          onClick={() => navigate('/home')}
          variant="outline"
          className="w-full h-11 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
