import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  User,
  BarChart3,
  List,
  Edit,
  Trash2,
  Plus,
  ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

interface PropertyParams {
  id: string;
}

export default function PropertyDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<PropertyParams>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");

  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: [`/api/properties/${params.id}`],
  });

  const { data: appraisals = [], isLoading: appraisalsLoading } = useQuery({
    queryKey: [`/api/appraisals?propertyId=${params.id}`],
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const handleDeleteProperty = async () => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await apiRequest(`/api/properties/${params.id}`, {
          method: "DELETE",
        });
        
        toast({
          title: "Property deleted",
          description: "The property has been deleted successfully",
        });
        
        setLocation("/properties");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete property",
          variant: "destructive",
        });
      }
    }
  };

  if (propertyLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLocation("/properties")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setLocation(`/properties/${params.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Property
          </Button>
          <Button variant="destructive" onClick={handleDeleteProperty}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Property Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{property?.address}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {property?.city}, {property?.state} {property?.zipCode}
          </span>
          {property?.propertyType && (
            <Badge className="ml-2">{property.propertyType}</Badge>
          )}
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
        </TabsList>
        
        {/* Property Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5 text-primary" />
                  Physical Characteristics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium">{property?.propertyType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-medium">{property?.yearBuilt || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Square Footage</p>
                    <p className="font-medium">{property?.squareFeet?.toLocaleString() || "N/A"} sq ft</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="font-medium">{property?.lotSize ? `${property.lotSize} acres` : "N/A"}</p>
                  </div>
                  {(property?.bedrooms || property?.bathrooms) && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-medium">{property?.bedrooms || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="font-medium">{property?.bathrooms || "N/A"}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{property?.description || "No description available."}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{property?.status || "N/A"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{property?.createdAt ? formatDate(property.createdAt) : "N/A"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{property?.updatedAt ? formatDate(property.updatedAt) : "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={() => setLocation(`/market-analysis/${params.id}`)}
            >
              <BarChart3 className="mr-2 h-4 w-4" /> View Market Analysis
            </Button>
          </div>
        </TabsContent>
        
        {/* Appraisals Tab */}
        <TabsContent value="appraisals" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Property Appraisals</h2>
            <Button onClick={() => setLocation(`/properties/${params.id}/appraisals/new`)}>
              <Plus className="mr-2 h-4 w-4" /> New Appraisal
            </Button>
          </div>
          
          {appraisalsLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          ) : appraisals.length > 0 ? (
            <div className="space-y-4">
              {appraisals.map((appraisal: any) => (
                <Card key={appraisal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">{appraisal.name || "Unnamed Appraisal"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {appraisal.appraisalDate ? formatDate(appraisal.appraisalDate) : "No date"}
                          {appraisal.dueDate && ` - Due: ${formatDate(appraisal.dueDate)}`}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              appraisal.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : appraisal.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {appraisal.status === "in_progress" ? "In Progress" : 
                             appraisal.status === "completed" ? "Completed" : 
                             appraisal.status || "Pending"}
                          </Badge>
                          {appraisal.finalValue && (
                            <span className="text-sm font-semibold">
                              {formatCurrency(appraisal.finalValue)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button onClick={() => setLocation(`/appraisals/${appraisal.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg mb-4">No appraisals for this property yet</p>
                <Button onClick={() => setLocation(`/properties/${params.id}/appraisals/new`)}>
                  <Plus className="mr-2 h-4 w-4" /> Create First Appraisal
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Market Data Tab */}
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Market Analysis
              </CardTitle>
              <CardDescription>
                View comprehensive market data for this property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Access detailed market analysis for this property including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Local market trends and property value indicators</li>
                <li>Comparable sales in the neighborhood</li>
                <li>Price per square foot analysis</li>
                <li>Historical price trends and future projections</li>
                <li>Direct comparison to similar properties</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setLocation(`/market-analysis/${params.id}`)}>
                <BarChart3 className="mr-2 h-4 w-4" /> View Full Market Analysis
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}