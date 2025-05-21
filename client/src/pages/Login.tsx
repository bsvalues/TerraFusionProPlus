import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, LogIn } from 'lucide-react';
import { apiRequest } from '../lib/query-client';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both username and password',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, we would connect to the API
      // const response = await apiRequest('/api/users/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ username, password }),
      // });
      
      // Mock authentication for demo
      // In a real app, we would store the token in localStorage and set up auth context
      if (username === 'admin' && password === 'password') {
        toast({
          title: 'Success',
          description: 'You have been logged in successfully',
        });
        
        // Redirect to dashboard
        navigate('/');
      } else {
        toast({
          title: 'Error',
          description: 'Invalid username or password',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log in. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-card border rounded-lg shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">TerraFusionProfessional</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to access the real estate appraisal platform
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </span>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Demo credentials: username: "admin", password: "password"</p>
        </div>
      </div>
    </div>
  );
};

export default Login;