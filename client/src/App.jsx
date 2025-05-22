import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PipelinePage from './pages/PipelinePage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Switch>
          <Route path="/" exact component={PipelinePage} />
        </Switch>
      </div>
    </QueryClientProvider>
  );
}

export default App;