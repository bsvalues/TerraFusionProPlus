import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Plus, Search, Home, Eye, Edit, Trash2, TrendingUp, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch properties
  const { data: properties = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/properties'],
  });

  // Filter properties based on search query
  const filteredProperties = searchQuery
    ? properties.filter((property: any) => 
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.zip_code.includes(searchQuery)
      )
    : properties;

  // Handle property deletion
  const handleDeleteClick = (propertyId: number) => {
    setPropertyToDelete(propertyId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    
    try {
      await apiRequest(`/api/properties/${propertyToDelete}`, {
        method: 'DELETE',
      });
      
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
      });
      
      // Close dialog and refresh the properties list
      setDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the property. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Property type badge display
  const getPropertyTypeBadge = (type: string) => {
    const types: Record<string, { label: string, variant: "default" | "secondary" | "outline" }> = {
      "Single Family": { label: "Single Family", variant: "default" },
      "Commercial": { label: "Commercial", variant: "secondary" },
      "Industrial": { label: "Industrial", variant: "outline" },
      "Land": { label: "Land", variant: "outline" },
      "Multi-Family": { label: "Multi-Family", variant: "secondary" },
      "Mixed Use": { label: "Mixed Use", variant: "secondary" },
      "Special Purpose": { label: "Special Purpose", variant: "outline" },
    };

    const typeInfo = types[type] || { label: type, variant: "default" };
    return <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Property Portfolio</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setLocation("/market-analysis")}>
            <TrendingUp className="mr-2 h-4 w-4" /> Market Analysis
          </Button>
          <Button onClick={() => setLocation("/properties/new")}>
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties by address, city or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Properties grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property: any) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {property.property_type === 'Land' ? (
                  <Building size={40} className="text-gray-400" />
                ) : (
                  <Home size={40} className="text-gray-400" />
                )}
              </div>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{property.address}</CardTitle>
                    <CardDescription>
                      {property.city}, {property.state} {property.zipCode}
                    </CardDescription>
                  </div>
                  {getPropertyTypeBadge(property.propertyType)}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                  {property.yearBuilt && <span>Built: {property.yearBuilt}</span>}
                  {property.squareFeet && <span>{property.squareFeet} sq ft</span>}
                  {property.propertyType === 'Single Family' && (
                    <>
                      {property.bedrooms && <span>{property.bedrooms} bed</span>}
                      {property.bathrooms && <span>{property.bathrooms} bath</span>}
                    </>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setLocation(`/properties/${property.id}`)}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setLocation(`/market-analysis/${property.id}`)}>
                      <BarChart3 className="mr-2 h-4 w-4" /> Market
                    </Button>
                  </div>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setLocation(`/properties/${property.id}/edit`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(property.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No properties match your search criteria. Try a different search."
              : "You haven't added any properties yet."}
          </p>
          {!searchQuery && (
            <Button onClick={() => setLocation("/properties/new")}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Property
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}