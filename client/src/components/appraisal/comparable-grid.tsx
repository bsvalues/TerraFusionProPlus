import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  Building,
  Calendar,
  DollarSign,
  Download,
  Printer,
  Ruler,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparableGridProps {
  subject: any;
  comparables: any[];
  onPrint?: () => void;
}

export default function ComparableGrid({ subject, comparables, onPrint }: ComparableGridProps) {
  const [sortField, setSortField] = useState<string>("salePrice");
  const [selectedComparables, setSelectedComparables] = useState<number[]>([]);
  
  // Format values for display
  const formatCurrency = (value?: number) => {
    if (!value && value !== 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MM/dd/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  const formatNumber = (value?: number) => {
    if (!value && value !== 0) return "N/A";
    return value.toLocaleString();
  };
  
  // Sort comparables
  const sortedComparables = [...comparables].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortField === "proximityMiles" ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return bValue.getTime() - aValue.getTime();
    }
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue);
    }
    
    return 0;
  });
  
  // Calculate % difference from subject property
  const calculateDifference = (value?: number, subjectValue?: number) => {
    if (value === undefined || subjectValue === undefined || subjectValue === 0) {
      return null;
    }
    
    const diff = ((value - subjectValue) / subjectValue) * 100;
    return diff.toFixed(1);
  };
  
  // Calculate price per square foot
  const calculatePricePerSqFt = (price?: number, sqft?: number) => {
    if (!price || !sqft || sqft === 0) return "N/A";
    return `$${Math.round(price / sqft)}`;
  };
  
  // Toggle a comparable selection
  const toggleComparable = (id: number) => {
    setSelectedComparables(prev => 
      prev.includes(id) 
        ? prev.filter(compId => compId !== id)
        : [...prev, id]
    );
  };
  
  // Check if all comparables are selected
  const allSelected = comparables.length > 0 && selectedComparables.length === comparables.length;
  
  // Toggle all comparables
  const toggleAllComparables = () => {
    if (allSelected) {
      setSelectedComparables([]);
    } else {
      setSelectedComparables(comparables.map(comp => comp.id));
    }
  };
  
  // Filter to only selected comparables if any are selected
  const displayedComparables = selectedComparables.length > 0
    ? sortedComparables.filter(comp => selectedComparables.includes(comp.id))
    : sortedComparables;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Comparable Properties Analysis</CardTitle>
            <CardDescription>
              Compare subject property with similar properties in the area
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salePrice">Sale Price</SelectItem>
                <SelectItem value="saleDate">Sale Date</SelectItem>
                <SelectItem value="squareFeet">Square Footage</SelectItem>
                <SelectItem value="proximityMiles">Proximity</SelectItem>
                <SelectItem value="yearBuilt">Year Built</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={toggleAllComparables}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="min-w-[150px]">Property</TableHead>
                <TableHead>Sale Price</TableHead>
                <TableHead>$/SqFt</TableHead>
                <TableHead>SqFt</TableHead>
                <TableHead>Bed/Bath</TableHead>
                <TableHead>Year Built</TableHead>
                <TableHead>Sale Date</TableHead>
                <TableHead>Distance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Subject Property */}
              <TableRow className="bg-muted/30">
                <TableCell>
                  <div className="font-medium text-primary">Subject</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{subject.address}</div>
                  <div className="text-xs text-muted-foreground">{subject.city}, {subject.state}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">TBD</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">TBD</div>
                </TableCell>
                <TableCell>{formatNumber(subject.squareFeet)}</TableCell>
                <TableCell>{subject.bedrooms}/{subject.bathrooms}</TableCell>
                <TableCell>{subject.yearBuilt}</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>0.0 mi</TableCell>
              </TableRow>
              
              {/* Comparable Properties */}
              {displayedComparables.map((comp) => {
                // Calculate differences
                const priceDiff = calculateDifference(comp.salePrice, subject.estimatedValue);
                const sizeDiff = calculateDifference(comp.squareFeet, subject.squareFeet);
                const ageDiff = subject.yearBuilt && comp.yearBuilt ? 
                  comp.yearBuilt - subject.yearBuilt : null;
                
                return (
                  <TableRow key={comp.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedComparables.includes(comp.id)}
                        onCheckedChange={() => toggleComparable(comp.id)}
                        aria-label={`Select ${comp.address}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{comp.address}</div>
                      <div className="text-xs text-muted-foreground">{comp.city}, {comp.state}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(comp.salePrice)}</div>
                      {priceDiff && (
                        <div className={cn(
                          "text-xs",
                          Number(priceDiff) > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {Number(priceDiff) > 0 ? "+" : ""}{priceDiff}%
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {calculatePricePerSqFt(comp.salePrice, comp.squareFeet)}
                    </TableCell>
                    <TableCell>
                      <div>{formatNumber(comp.squareFeet)}</div>
                      {sizeDiff && (
                        <div className={cn(
                          "text-xs",
                          Number(sizeDiff) > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {Number(sizeDiff) > 0 ? "+" : ""}{sizeDiff}%
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{comp.bedrooms}/{comp.bathrooms}</TableCell>
                    <TableCell>
                      <div>{comp.yearBuilt}</div>
                      {ageDiff !== null && (
                        <div className="text-xs text-muted-foreground">
                          {ageDiff > 0 ? "+" : ""}{ageDiff} yrs
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(comp.saleDate)}</TableCell>
                    <TableCell>{comp.proximityMiles?.toFixed(1)} mi</TableCell>
                  </TableRow>
                );
              })}
              
              {/* No comparables message */}
              {comparables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No comparable properties found. Add comparables to begin analysis.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {comparables.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Price Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Sale Price:</span>
                    <span className="font-medium">
                      {formatCurrency(displayedComparables.reduce((sum, comp) => 
                        sum + (comp.salePrice || 0), 0) / displayedComparables.length)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Median Sale Price:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        displayedComparables
                          .map(comp => comp.salePrice || 0)
                          .sort((a, b) => a - b)[Math.floor(displayedComparables.length / 2)]
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Price Range:</span>
                    <span className="font-medium">
                      {formatCurrency(Math.min(...displayedComparables.map(comp => comp.salePrice || 0)))} - 
                      {formatCurrency(Math.max(...displayedComparables.map(comp => comp.salePrice || 0)))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center">
                  <Ruler className="h-4 w-4 mr-1" />
                  Size Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Subject Size:</span>
                    <span className="font-medium">{formatNumber(subject.squareFeet)} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Comp Size:</span>
                    <span className="font-medium">
                      {formatNumber(
                        Math.round(
                          displayedComparables.reduce((sum, comp) => 
                            sum + (comp.squareFeet || 0), 0) / displayedComparables.length
                        )
                      )} sqft
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Price/SqFt:</span>
                    <span className="font-medium">
                      ${Math.round(
                        displayedComparables.reduce((sum, comp) => 
                          sum + ((comp.salePrice || 0) / (comp.squareFeet || 1)), 0) / displayedComparables.length
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Sale Recency
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Most Recent Sale:</span>
                    <span className="font-medium">
                      {formatDate(
                        displayedComparables
                          .filter(comp => comp.saleDate)
                          .sort((a, b) => 
                            new Date(b.saleDate).getTime() - 
                            new Date(a.saleDate).getTime()
                          )[0]?.saleDate
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Oldest Sale:</span>
                    <span className="font-medium">
                      {formatDate(
                        displayedComparables
                          .filter(comp => comp.saleDate)
                          .sort((a, b) => 
                            new Date(a.saleDate).getTime() - 
                            new Date(b.saleDate).getTime()
                          )[0]?.saleDate
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sales Count:</span>
                    <span className="font-medium">{displayedComparables.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}