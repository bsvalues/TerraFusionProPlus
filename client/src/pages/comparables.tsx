import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Search,
  Edit, 
  Trash2,
  Building,
  DollarSign,
  Ruler,
  MapPin
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function ComparablesPage() {
  const { appraisalId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [comparableToDelete, setComparableToDelete] = useState<number | null>(null);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch comparables for this appraisal
  const { data: comparables = [], isLoading, refetch } = useQuery({
    queryKey: [`/api/appraisals/${appraisalId}/comparables`],
    enabled: Boolean(appraisalId),
  });

  // Fetch parent appraisal information
  const { data: appraisal } = useQuery({
    queryKey: [`/api/appraisals/${appraisalId}`],
    enabled: Boolean(appraisalId),
  });

  // Fetch property information (if we have appraisal data)
  const { data: property } = useQuery({
    queryKey: [`/api/properties/${appraisal?.propertyId}`],
    enabled: Boolean(appraisal?.propertyId),
  });

  // Handle comparable deletion
  const handleDeleteClick = (comparableId: number) => {
    setComparableToDelete(comparableId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!comparableToDelete) return;
    
    try {
      await apiRequest(`/api/comparables/${comparableToDelete}`, {
        method: 'DELETE',
      });
      
      toast({
        title: "Comparable Deleted",
        description: "The comparable property has been successfully deleted.",
      });
      
      // Close dialog and refresh the comparables list
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/appraisals/${appraisalId}/comparables`] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the comparable property. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter comparables based on search query
  const filteredComparables = comparables.filter((comparable: any) => {
    return searchQuery
      ? (comparable.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         comparable.city?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format area
  const formatArea = (area: number) => {
    return `${area.toLocaleString()} sq ft`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Comparable Properties</h1>
          {property && (
            <p className="text-muted-foreground">
              For appraisal of {property.address}, {property.city}
            </p>
          )}
        </div>
        <Button onClick={() => setLocation(`/appraisals/${appraisalId}/comparables/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add Comparable
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by address or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Property being appraised (reference) */}
      {property && (
        <Card className="mb-6 bg-muted/50 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Subject Property (Reference)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Address</span>
                <span className="font-medium">{property.address}, {property.city}</span>
              </div>
              {property.squareFeet && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">Area</span>
                  <span className="font-medium">{formatArea(property.squareFeet)}</span>
                </div>
              )}
              {property.bedrooms && property.bathrooms && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">Layout</span>
                  <span className="font-medium">{property.bedrooms} bed, {property.bathrooms} bath</span>
                </div>
              )}
              {property.yearBuilt && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">Year Built</span>
                  <span className="font-medium">{property.yearBuilt}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparables List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : filteredComparables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComparables.map((comparable: any) => (
            <Card key={comparable.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{comparable.address}</h3>
                    <p className="text-sm text-muted-foreground">{comparable.city}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setLocation(`/appraisals/${appraisalId}/comparables/${comparable.id}/edit`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(comparable.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {comparable.salePrice && (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                      <span className="text-sm font-medium">{formatCurrency(comparable.salePrice)}</span>
                    </div>
                  )}
                  {comparable.saleDate && (
                    <div className="flex items-center">
                      <span className="text-sm">
                        Sold: {format(new Date(comparable.saleDate), 'MM/dd/yyyy')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {comparable.squareFeet && (
                    <div className="flex items-center">
                      <Ruler className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span>{formatArea(comparable.squareFeet)}</span>
                    </div>
                  )}
                  {comparable.bedrooms && comparable.bathrooms && (
                    <div className="flex items-center">
                      <Building className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span>{comparable.bedrooms}b/{comparable.bathrooms}b</span>
                    </div>
                  )}
                  {comparable.proximityMiles && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span>{comparable.proximityMiles} mi</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No comparable properties</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No comparable properties match your search criteria."
              : "Add comparable properties to help determine the market value."}
          </p>
          {!searchQuery && (
            <Button onClick={() => setLocation(`/appraisals/${appraisalId}/comparables/new`)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Comparable
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
              Are you sure you want to delete this comparable property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Comparable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}