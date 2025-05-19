import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/layout";

// Import existing pages that we'll repurpose
import Dashboard from "@/pages/dashboard";
import Infrastructure from "@/pages/infrastructure"; // Will become Property Portfolio
import Pipelines from "@/pages/pipelines"; // Will become Appraisal Workflows
import Security from "@/pages/security"; // Will become User Management
import Monitoring from "@/pages/monitoring"; // Will become Analytics
import LocalSetup from "@/pages/local-setup"; // Will become Field Data Collection
import Documentation from "@/pages/documentation"; // Will become Help Center

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Dashboard - Main overview of properties and appraisals */}
        <Route path="/" component={Dashboard} />
        
        {/* Property Management */}
        <Route path="/properties" component={Infrastructure} />
        
        {/* Appraisal Workflows */}
        <Route path="/appraisals" component={Pipelines} />
        
        {/* Property Analytics and Reports */}
        <Route path="/analytics" component={Monitoring} />
        
        {/* User Management */}
        <Route path="/users" component={Security} />
        
        {/* Field Data Collection */}
        <Route path="/field-data" component={LocalSetup} />
        
        {/* Help and Documentation */}
        <Route path="/help" component={Documentation} />
        
        {/* Fallback for 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
