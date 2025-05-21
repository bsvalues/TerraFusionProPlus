import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="space-y-6 max-w-md">
        <div className="bg-primary/10 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
        
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to the dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;