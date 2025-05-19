import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Comparable, Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";

interface ComparableGridProps {
  subject: Property;
  comparables: Comparable[];
  onPrint?: () => void;
}

export default function ComparableGrid({ 
  subject, 
  comparables,
  onPrint 
}: ComparableGridProps) {
  // Helper function to format currency values
  const formatCurrency = useCallback((value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }, []);

  // Helper function to format percentages
  const formatPercentage = useCallback((value: number | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    return `${value}%`;
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Comparable Properties Grid</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-2 border border-gray-200 text-left font-medium">Property</th>
                <th className="p-2 border border-gray-200 text-center font-medium">Subject</th>
                {comparables.map((comp, index) => (
                  <th key={comp.id} className="p-2 border border-gray-200 text-center font-medium">
                    Comparable {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-gray-200 font-medium">Address</td>
                <td className="p-2 border border-gray-200">{subject.address}</td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200">{comp.address}</td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 font-medium">City</td>
                <td className="p-2 border border-gray-200">{subject.city}</td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200">{comp.city}</td>
                ))}
              </tr>
              <tr className="bg-slate-50">
                <td className="p-2 border border-gray-200 font-medium">Sale Price</td>
                <td className="p-2 border border-gray-200">Subject</td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200 font-medium text-primary">
                    {formatCurrency(comp.salePrice)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 font-medium">Property Type</td>
                <td className="p-2 border border-gray-200">{subject.propertyType}</td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200">{comp.propertyType}</td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 font-medium">Size (sq ft)</td>
                <td className="p-2 border border-gray-200">{subject.squareFeet?.toLocaleString() || "N/A"}</td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200">
                    {comp.squareFeet?.toLocaleString() || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 font-medium">Bed/Bath</td>
                <td className="p-2 border border-gray-200">{subject.bedrooms || "N/A"}/{subject.bathrooms || "N/A"}</td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200">
                    {comp.bedrooms || "N/A"}/{comp.bathrooms || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 font-medium">Year Built</td>
                <td className="p-2 border border-gray-200">{subject.yearBuilt || "N/A"}</td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200">{comp.yearBuilt || "N/A"}</td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 font-medium">Lot Size</td>
                <td className="p-2 border border-gray-200">
                  {subject.lotSize ? `${subject.lotSize} ${subject.lotUnit || "acres"}` : "N/A"}
                </td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200">
                    {comp.lotSize ? `${comp.lotSize} ${comp.lotUnit || "acres"}` : "N/A"}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50">
                <td className="p-2 border border-gray-200 font-medium">Price/Sq Ft</td>
                <td className="p-2 border border-gray-200">Subject</td>
                {comparables.map((comp) => {
                  const sqft = comp.squareFeet || 0;
                  const price = comp.salePrice || 0;
                  const pricePerSqft = sqft > 0 ? price / sqft : 0;
                  return (
                    <td key={comp.id} className="p-2 border border-gray-200">
                      {sqft > 0 ? `$${pricePerSqft.toFixed(2)}` : "N/A"}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 font-medium">Sale Date</td>
                <td className="p-2 border border-gray-200">Subject</td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200">
                    {comp.saleDate 
                      ? new Date(comp.saleDate).toLocaleDateString() 
                      : "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 font-medium">Distance</td>
                <td className="p-2 border border-gray-200">Subject</td>
                {comparables.map((comp) => (
                  <td key={comp.id} className="p-2 border border-gray-200">
                    {comp.proximityMiles ? `${comp.proximityMiles} miles` : "N/A"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        {comparables.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            <p>No comparable properties found. Add comparable properties to enable the grid view.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}