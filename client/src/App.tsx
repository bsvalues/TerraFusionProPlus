import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard";
import Infrastructure from "@/pages/infrastructure";
import Pipelines from "@/pages/pipelines";
import Security from "@/pages/security";
import Monitoring from "@/pages/monitoring";
import LocalSetup from "@/pages/local-setup";
import Documentation from "@/pages/documentation";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/infrastructure" component={Infrastructure} />
        <Route path="/pipelines" component={Pipelines} />
        <Route path="/security" component={Security} />
        <Route path="/monitoring" component={Monitoring} />
        <Route path="/local-setup" component={LocalSetup} />
        <Route path="/documentation" component={Documentation} />
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
