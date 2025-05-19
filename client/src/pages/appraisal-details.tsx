import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Edit,
  ChevronLeft, 
  Building, 
  Map, 
  FileText,
  Calendar,
  DollarSign,
  User,
  Clock,
  Clipboard,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AppraisalDetails() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch the appraisal data
  const { data: appraisal, isLoading: appraisalLoading } = useQuery({
    queryKey: [`/api/appraisals/${id}`],
    enabled: Boolean(id),
  });
  
  // Fetch the property data if we have appraisal
  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: [`/api/properties/${appraisal?.propertyId}`],
    enabled: Boolean(appraisal?.propertyId),
  });
  
  // Fetch the assigned user data if we have appraisal
  const { data: assignedUser, isLoading: userLoading } = useQuery({
    queryKey: [`/api/users/${appraisal?.assignedTo}`],
    enabled: Boolean(appraisal?.assignedTo),
  });
  
  // Fetch comparable properties
  const { data: comparables = [], isLoading: comparablesLoading } = useQuery({
    queryKey: [`/api/appraisals/${id}/comparables`],
    enabled: Boolean(id),
  });
  
  // Fetch attachments
  const { data: attachments = [], isLoading: attachmentsLoading } = useQuery({
    queryKey: [`/api/attachments?appraisalId=${id}`],
    enabled: Boolean(id),
  });

  const isLoading = appraisalLoading || propertyLoading || userLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!appraisal) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Appraisal Not Found</h1>
          <p className="text-gray-500 mt-2">The requested appraisal could not be found.</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => setLocation('/appraisals')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Appraisals
          </Button>
        </div>
      </div>
    );
  }
  
  // Format the appraisal date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  // Format the status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-200 text-gray-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "review": return "bg-yellow-100 text-yellow-800";
      case "complete": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Format the status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "draft": return "Draft";
      case "in_progress": return "In Progress";
      case "review": return "In Review";
      case "complete": return "Complete";
      default: return status;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with navigation and actions */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setLocation('/appraisals')}
            className="mb-2"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Appraisals
          </Button>
          <h1 className="text-2xl font-bold">{property?.address}</h1>
          <div className="flex items-center mt-1 text-gray-500">
            <Building className="h-4 w-4 mr-1" />
            <span>{property?.city}, {property?.state} {property?.zipCode}</span>
            <Badge className={`ml-3 ${getStatusColor(appraisal.status)}`}>
              {getStatusDisplay(appraisal.status)}
            </Badge>
          </div>
        </div>
        <Button onClick={() => setLocation(`/appraisals/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Appraisal
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparables">Comparable Properties</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  Property Details
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
                    <p className="text-sm text-muted-foreground">Square Feet</p>
                    <p className="font-medium">{property?.squareFeet?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="font-medium">{property?.lotSize ? `${property.lotSize} acres` : "N/A"}</p>
                  </div>
                  {property?.bedrooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-medium">{property.bedrooms}</p>
                    </div>
                  )}
                  {property?.bathrooms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-medium">{property.bathrooms}</p>
                    </div>
                  )}
                </div>
                {property?.description && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p>{property.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setLocation(`/properties/${property?.id}/edit`)}>
                  View Full Property Details
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Appraisal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Appraisal Date</p>
                    <p className="font-medium">{formatDate(appraisal.appraisalDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium">{formatDate(appraisal.dueDate)}</p>
                  </div>
                  {appraisal.estimatedValue && (
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Value</p>
                      <p className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(appraisal.estimatedValue)}</p>
                    </div>
                  )}
                  {appraisal.finalValue && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Final Value</p>
                      <p className="font-medium text-lg text-primary">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(appraisal.finalValue)}
                      </p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{assignedUser?.name || "Unassigned"}</p>
                  </div>
                </div>
                
                {(appraisal.clientName || appraisal.clientReference) && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {appraisal.clientName && (
                        <div>
                          <p className="text-sm text-muted-foreground">Client</p>
                          <p className="font-medium">{appraisal.clientName}</p>
                        </div>
                      )}
                      {appraisal.clientReference && (
                        <div>
                          <p className="text-sm text-muted-foreground">Client Reference</p>
                          <p className="font-medium">{appraisal.clientReference}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {appraisal.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p>{appraisal.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Comparables Tab */}
        <TabsContent value="comparables" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Comparable Properties</h2>
            <Button onClick={() => setLocation(`/appraisals/${id}/comparables/new`)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Comparable
            </Button>
          </div>
          
          {comparablesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : comparables.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparables.map((comparable: any) => (
                <Card key={comparable.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{comparable.address}</h3>
                        <p className="text-sm text-muted-foreground">{comparable.city}, {comparable.state}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setLocation(`/appraisals/${id}/comparables/${comparable.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: 'USD',
                          maximumFractionDigits: 0
                        }).format(comparable.salePrice)}
                      </span>
                      {comparable.saleDate && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          Sold: {format(new Date(comparable.saleDate), "MM/dd/yyyy")}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {comparable.squareFeet && (
                        <div>
                          <span className="text-muted-foreground">Area:</span> {comparable.squareFeet.toLocaleString()} sqft
                        </div>
                      )}
                      {comparable.bedrooms && comparable.bathrooms && (
                        <div>
                          <span className="text-muted-foreground">Layout:</span> {comparable.bedrooms}b/{comparable.bathrooms}b
                        </div>
                      )}
                      {comparable.yearBuilt && (
                        <div>
                          <span className="text-muted-foreground">Built:</span> {comparable.yearBuilt}
                        </div>
                      )}
                      {comparable.proximityMiles && (
                        <div>
                          <span className="text-muted-foreground">Distance:</span> {comparable.proximityMiles} mi
                        </div>
                      )}
                    </div>
                    
                    {comparable.adjustments !== 0 && comparable.adjustedPrice && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Adjustments:</span>
                          <span className="text-sm">
                            {new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: 'USD',
                              maximumFractionDigits: 0
                            }).format(comparable.adjustments)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Adjusted Value:</span>
                          <span className="text-sm font-medium">
                            {new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: 'USD',
                              maximumFractionDigits: 0
                            }).format(comparable.adjustedPrice)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="py-6 text-center">
                <Building className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No comparables added yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add comparable properties to help determine an accurate market value
                </p>
                <Button onClick={() => setLocation(`/appraisals/${id}/comparables/new`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Comparable
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => setLocation(`/appraisals/${id}/comparables`)}>
              Manage All Comparables
            </Button>
          </div>
        </TabsContent>
        
        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Documents & Attachments</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Attachment
            </Button>
          </div>
          
          {attachmentsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : attachments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attachments.map((attachment: any) => (
                <Card key={attachment.id}>
                  <CardContent className="p-4 flex items-center">
                    <FileText className="h-8 w-8 text-blue-500 mr-3" />
                    <div className="flex-1">
                      <h3 className="font-medium">{attachment.filename}</h3>
                      <p className="text-sm text-muted-foreground">
                        {attachment.type} • {formatDate(attachment.uploadedAt)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="py-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No attachments added yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add documents, photos, and other files related to this appraisal
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Attachment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}