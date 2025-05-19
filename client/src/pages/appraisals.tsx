import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Plus, 
  Search,
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  UserCheck,
  Building,
  DollarSign
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";

export default function AppraisalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appraisalToDelete, setAppraisalToDelete] = useState<number | null>(null);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch appraisals
  const { data: appraisals = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/appraisals'],
  });

  // Fetch properties for reference
  const { data: properties = [] } = useQuery({
    queryKey: ['/api/properties'],
  });

  // Fetch users (appraisers) for reference
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
  });

  // Helper to get property address from propertyId
  const getPropertyAddress = (propertyId: number) => {
    const property = properties.find((p: any) => p.id === propertyId);
    return property ? `${property.address}, ${property.city}` : "Unknown property";
  };

  // Helper to get appraiser name from userId
  const getAppraiserName = (userId: number) => {
    const user = users.find((u: any) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unassigned";
  };

  // Filter appraisals based on search query and status filter
  const filteredAppraisals = appraisals.filter((appraisal: any) => {
    const matchesSearch = searchQuery 
      ? (getPropertyAddress(appraisal.propertyId).toLowerCase().includes(searchQuery.toLowerCase()) ||
         (appraisal.clientName && appraisal.clientName.toLowerCase().includes(searchQuery.toLowerCase())))
      : true;
    
    const matchesStatusFilter = statusFilter 
      ? appraisal.status === statusFilter
      : true;
    
    return matchesSearch && matchesStatusFilter;
  });

  // Handle appraisal deletion
  const handleDeleteClick = (appraisalId: number) => {
    setAppraisalToDelete(appraisalId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!appraisalToDelete) return;
    
    try {
      await apiRequest(`/api/appraisals/${appraisalToDelete}`, {
        method: 'DELETE',
      });
      
      toast({
        title: "Appraisal Deleted",
        description: "The appraisal has been successfully deleted.",
      });
      
      // Close dialog and refresh the appraisals list
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/appraisals'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the appraisal. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Status badge display
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "outline" | "destructive" }> = {
      draft: { label: "Draft", variant: "outline" },
      in_progress: { label: "In Progress", variant: "secondary" },
      review: { label: "In Review", variant: "default" },
      complete: { label: "Complete", variant: "default" },
    };

    const statusInfo = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Appraisal Workflows</h1>
          <p className="text-muted-foreground">Manage your property appraisals</p>
        </div>
        <Button onClick={() => setLocation("/appraisals/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Appraisal
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by property or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Appraisals List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : filteredAppraisals.length > 0 ? (
        <div className="space-y-4">
          {filteredAppraisals.map((appraisal: any) => (
            <Card key={appraisal.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{getPropertyAddress(appraisal.propertyId)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {appraisal.purpose} appraisal • {appraisal.appraisalType} type
                        </p>
                      </div>
                      {getStatusBadge(appraisal.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          Effective: {format(new Date(appraisal.effectiveDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      {appraisal.dueDate && (
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            Due: {format(new Date(appraisal.dueDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm">
                        <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Appraiser: {appraisal.assignedTo ? getAppraiserName(appraisal.assignedTo) : "Unassigned"}</span>
                      </div>
                    </div>
                    
                    {appraisal.marketValue && (
                      <div className="mt-3 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {formatCurrency(appraisal.marketValue)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 md:p-6 flex flex-row md:flex-col justify-between items-center md:items-start gap-4 md:border-l">
                    <div>
                      {appraisal.clientName && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Client:</span> {appraisal.clientName}
                        </div>
                      )}
                      {appraisal.clientReference && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Ref:</span> {appraisal.clientReference}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex md:flex-col gap-2">
                      <Button size="sm" variant="outline" onClick={() => setLocation(`/appraisals/${appraisal.id}`)}>
                        <Eye className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">View</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setLocation(`/appraisals/${appraisal.id}/edit`)}>
                        <Edit className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Edit</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(appraisal.id)}>
                        <Trash2 className="h-4 w-4 md:mr-2 text-destructive" />
                        <span className="hidden md:inline text-destructive">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No appraisals found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter
              ? "No appraisals match your search criteria. Try different filters."
              : "You haven't created any appraisals yet."}
          </p>
          {!searchQuery && !statusFilter && (
            <Button onClick={() => setLocation("/appraisals/new")}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Appraisal
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
              Are you sure you want to delete this appraisal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Appraisal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}