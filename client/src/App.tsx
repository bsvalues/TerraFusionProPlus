import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/layout";

// Dashboard
import Dashboard from "@/pages/dashboard";

// Property Management
import Properties from "@/pages/properties";
import PropertyForm from "@/pages/property-form";

// Appraisal Management
import Appraisals from "@/pages/appraisals";
import AppraisalForm from "@/pages/appraisal-form";

// Existing pages repurposed for different sections
import Security from "@/pages/security"; // Used for User Management
import Monitoring from "@/pages/monitoring"; // Used for Analytics
import LocalSetup from "@/pages/local-setup"; // Used for Field Data Collection
import Documentation from "@/pages/documentation"; // Used for Help Center

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Dashboard - Main overview of properties and appraisals */}
        <Route path="/" component={Dashboard} />
        
        {/* Property Management */}
        <Route path="/properties" component={Properties} />
        <Route path="/properties/new" component={PropertyForm} />
        <Route path="/properties/:id/edit" component={PropertyForm} />
        
        {/* Appraisal Workflows */}
        <Route path="/appraisals" component={Appraisals} />
        <Route path="/appraisals/new" component={AppraisalForm} />
        <Route path="/appraisals/:id/edit" component={AppraisalForm} />
        <Route path="/properties/:propertyId/appraisals/new" component={AppraisalForm} />
        
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
