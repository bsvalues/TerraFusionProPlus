import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppraisalSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Extend the appraisal schema with additional validation rules
const formSchema = insertAppraisalSchema.extend({
  propertyId: z.number().min(1, { message: "Property selection is required" }),
  appraisalDate: z.date({ required_error: "Appraisal date is required" }),
  effectiveDate: z.date({ required_error: "Effective date is required" }),
  purpose: z.string().min(1, { message: "Purpose is required" }),
  appraisalType: z.string().min(1, { message: "Appraisal type is required" }),
  marketValue: z.number().optional(),
  approachesUsed: z.any().optional(),
});

type AppraisalFormValues = z.infer<typeof formSchema>;

export default function AppraisalForm({ 
  appraisal,
  propertyId,
  onSuccess 
}: { 
  appraisal?: any;
  propertyId?: number;
  onSuccess?: (data: any) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Fetch properties for selection
  const { data: properties = [] } = useQuery({
    queryKey: ['/api/properties'],
    enabled: !propertyId,
  });

  // Fetch assigned users (appraisers)
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    select: (data) => data.filter((user: any) => user.role === 'appraiser' || user.role === 'admin')
  });

  // Initialize the form with existing appraisal data or defaults
  const form = useForm<AppraisalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: appraisal || {
      propertyId: propertyId || 0,
      appraisalDate: new Date(),
      effectiveDate: new Date(),
      purpose: "purchase",
      appraisalType: "full",
      status: "draft",
      approachesUsed: ["sales_comparison"],
    },
  });

  // Update propertyId when provided externally
  useEffect(() => {
    if (propertyId) {
      form.setValue('propertyId', propertyId);
    }
  }, [propertyId, form]);

  const onSubmit = async (data: AppraisalFormValues) => {
    setIsSubmitting(true);
    try {
      const endpoint = appraisal?.id ? `/api/appraisals/${appraisal.id}` : '/api/appraisals';
      const method = appraisal?.id ? 'PUT' : 'POST';
      
      const result = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(data),
      });
      
      toast({
        title: appraisal?.id ? "Appraisal Updated" : "Appraisal Created",
        description: "Appraisal details have been saved successfully.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/appraisals'] });
      
      if (onSuccess) {
        onSuccess(result);
      } else {
        setLocation("/appraisals");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save appraisal details. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving appraisal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{appraisal?.id ? "Edit Appraisal" : "Create New Appraisal"}</CardTitle>
        <CardDescription>
          Enter the details for this property appraisal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Selection */}
              {!propertyId && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Property Information</h3>
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value ? field.value.toString() : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {properties.map((property: any) => (
                              <SelectItem key={property.id} value={property.id.toString()}>
                                {property.address}, {property.city}, {property.state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {/* Appraisal Basic Info */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4">Appraisal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="purchase">Purchase</SelectItem>
                            <SelectItem value="refinance">Refinance</SelectItem>
                            <SelectItem value="estate">Estate Settlement</SelectItem>
                            <SelectItem value="tax">Tax Assessment</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="investment">Investment Analysis</SelectItem>
                            <SelectItem value="litigation">Litigation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appraisalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appraisal Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full">Full Appraisal</SelectItem>
                            <SelectItem value="drive_by">Drive-By</SelectItem>
                            <SelectItem value="desktop">Desktop</SelectItem>
                            <SelectItem value="bpo">Broker Price Opinion</SelectItem>
                            <SelectItem value="rental">Rental Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="appraisalDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Appraisal Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="effectiveDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Effective Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Valuation and Status */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4">Valuation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="marketValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Value ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="250000" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="review">In Review</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Assignment and Client */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4">Assignment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned Appraiser</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                          defaultValue={field.value ? field.value.toString() : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Assign to appraiser" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map((user: any) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.firstName} {user.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Client name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clientReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Reference</FormLabel>
                        <FormControl>
                          <Input placeholder="Reference number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Select due date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : undefined)}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Notes */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes about this appraisal"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <CardFooter className="px-0 pb-0 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setLocation("/appraisals")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (appraisal?.id ? "Update Appraisal" : "Create Appraisal")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}