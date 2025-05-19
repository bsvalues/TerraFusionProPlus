import { useCallback } from "react";
import { WorksheetCell } from "@/components/ui/worksheet-cell";
import { Comparable, Adjustment, Property } from "@shared/schema";
import { calculateAdjustments } from "@/lib/calculations";

interface ComparablesTableProps {
  property: Property;
  comparables: Comparable[];
  adjustments: Adjustment[];
  onAdjustmentChange: (comparableId: number, type: string, value: number) => void;
}

export default function ComparablesTable({ 
  property, 
  comparables, 
  adjustments, 
  onAdjustmentChange 
}: ComparablesTableProps) {
  // Helper function to get adjustments for a specific comparable
  const getAdjustmentAmount = useCallback((comparableId: number, adjustmentType: string) => {
    const adjustment = adjustments.find(
      adj => adj.comparableId === comparableId && adj.adjustmentType === adjustmentType
    );
    return adjustment ? Number(adjustment.amount) : 0;
  }, [adjustments]);

  // Helper function to format currency values
  const formatCurrency = useCallback((value: number | string | null | undefined) => {
    if (value === null || value === undefined) return "";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? "" : `$${numValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }, []);

  // Helper function to format percentages
  const formatPercentage = useCallback((value: number | null | undefined) => {
    if (value === null || value === undefined) return "";
    return isNaN(value) ? "" : `${value.toFixed(1)}%`;
  }, []);

  // Get calculated results
  const calculatedResults = comparables.map(comp => calculateAdjustments(comp, adjustments));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-neutral-medium bg-white font-mono text-sm">
        <thead>
          <tr className="bg-neutral-light border-b border-neutral-medium">
            <th className="p-2 border-r border-neutral-medium text-left font-medium">Item</th>
            <th className="p-2 border-r border-neutral-medium text-center font-medium">Subject</th>
            {comparables.map((comp, index) => (
              <th key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium text-center font-medium`}>
                Comp {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Address</td>
            <td className="p-2 border-r border-neutral-medium">{property.address || ""}</td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium`}>
                {comp.address || ""}
              </td>
            ))}
          </tr>
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Proximity to Subject</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium`}>
                {comp.proximityMiles ? `${comp.proximityMiles} miles` : ""}
              </td>
            ))}
          </tr>
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Sale Price</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell`}>
                <WorksheetCell 
                  value={formatCurrency(comp.salePrice)}
                  editable={false}
                />
              </td>
            ))}
          </tr>
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Price Per Sq Ft</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {comparables.map((comp, index) => {
              const sqft = comp.squareFeet || 0;
              const price = comp.salePrice || 0;
              const ppsf = sqft > 0 ? price / sqft : 0;
              return (
                <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell`}>
                  <WorksheetCell 
                    value={ppsf > 0 ? `$${ppsf.toFixed(2)}` : ""}
                    editable={false}
                  />
                </td>
              );
            })}
          </tr>
          
          {/* Property characteristics */}
          <tr className="border-b border-neutral-medium bg-gray-100">
            <td colSpan={2 + comparables.length} className="p-2 font-medium">Property Characteristics</td>
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Property Type</td>
            <td className="p-2 border-r border-neutral-medium">{property.propertyType || ""}</td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium`}>
                {comp.propertyType || ""}
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Year Built</td>
            <td className="p-2 border-r border-neutral-medium">{property.yearBuilt || ""}</td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium`}>
                {comp.yearBuilt || ""}
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Square Feet</td>
            <td className="p-2 border-r border-neutral-medium">{property.squareFeet?.toLocaleString() || ""}</td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium`}>
                {comp.squareFeet?.toLocaleString() || ""}
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Bedrooms / Baths</td>
            <td className="p-2 border-r border-neutral-medium">
              {property.bedrooms || ""} / {property.bathrooms || ""}
            </td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium`}>
                {comp.bedrooms || ""} / {comp.bathrooms || ""}
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Lot Size</td>
            <td className="p-2 border-r border-neutral-medium">
              {property.lotSize ? `${property.lotSize} ${property.lotUnit || "acres"}` : ""}
            </td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium`}>
                {comp.lotSize ? `${comp.lotSize} ${comp.lotUnit || "acres"}` : ""}
              </td>
            ))}
          </tr>
          
          {/* Adjustments section */}
          <tr className="border-b border-neutral-medium bg-gray-100">
            <td colSpan={2 + comparables.length} className="p-2 font-medium">Adjustments</td>
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Location</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell`}>
                <WorksheetCell 
                  value={formatCurrency(getAdjustmentAmount(comp.id, "location"))}
                  type="currency"
                  onChange={(value) => {
                    const numValue = typeof value === "string" 
                      ? parseInt(value.replace(/[^0-9-]/g, "")) 
                      : value;
                    if (!isNaN(numValue as number)) {
                      onAdjustmentChange(comp.id, "location", numValue as number);
                    }
                  }}
                />
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Size (GLA)</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell`}>
                <WorksheetCell 
                  value={formatCurrency(getAdjustmentAmount(comp.id, "gla"))}
                  type="currency"
                  onChange={(value) => {
                    const numValue = typeof value === "string" 
                      ? parseInt(value.replace(/[^0-9-]/g, "")) 
                      : value;
                    if (!isNaN(numValue as number)) {
                      onAdjustmentChange(comp.id, "gla", numValue as number);
                    }
                  }}
                />
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Age/Condition</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell`}>
                <WorksheetCell 
                  value={formatCurrency(getAdjustmentAmount(comp.id, "condition"))}
                  type="currency"
                  onChange={(value) => {
                    const numValue = typeof value === "string" 
                      ? parseInt(value.replace(/[^0-9-]/g, "")) 
                      : value;
                    if (!isNaN(numValue as number)) {
                      onAdjustmentChange(comp.id, "condition", numValue as number);
                    }
                  }}
                />
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Quality</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell`}>
                <WorksheetCell 
                  value={formatCurrency(getAdjustmentAmount(comp.id, "quality"))}
                  type="currency"
                  onChange={(value) => {
                    const numValue = typeof value === "string" 
                      ? parseInt(value.replace(/[^0-9-]/g, "")) 
                      : value;
                    if (!isNaN(numValue as number)) {
                      onAdjustmentChange(comp.id, "quality", numValue as number);
                    }
                  }}
                />
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Bed/Bath Count</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell`}>
                <WorksheetCell 
                  value={formatCurrency(getAdjustmentAmount(comp.id, "room_count"))}
                  type="currency"
                  onChange={(value) => {
                    const numValue = typeof value === "string" 
                      ? parseInt(value.replace(/[^0-9-]/g, "")) 
                      : value;
                    if (!isNaN(numValue as number)) {
                      onAdjustmentChange(comp.id, "room_count", numValue as number);
                    }
                  }}
                />
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Other</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {comparables.map((comp, index) => (
              <td key={comp.id} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell`}>
                <WorksheetCell 
                  value={formatCurrency(getAdjustmentAmount(comp.id, "other"))}
                  type="currency"
                  onChange={(value) => {
                    const numValue = typeof value === "string" 
                      ? parseInt(value.replace(/[^0-9-]/g, "")) 
                      : value;
                    if (!isNaN(numValue as number)) {
                      onAdjustmentChange(comp.id, "other", numValue as number);
                    }
                  }}
                />
              </td>
            ))}
          </tr>
          
          {/* Summary rows */}
          <tr className="border-b border-neutral-medium bg-gray-100">
            <td colSpan={2 + comparables.length} className="p-2 font-medium">Summary</td>
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Total Adjustments</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {calculatedResults.map((result, index) => (
              <td key={index} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell calculated`}>
                {formatCurrency(result.netAdjustment)}
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Adjusted Price</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {calculatedResults.map((result, index) => (
              <td key={index} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell calculated font-medium`}>
                {formatCurrency(result.adjustedPrice)}
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Net Adjustment (%)</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {calculatedResults.map((result, index) => (
              <td key={index} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell calculated`}>
                {formatPercentage(result.netAdjustmentPercentage)}
              </td>
            ))}
          </tr>
          
          <tr className="border-b border-neutral-medium">
            <td className="p-2 border-r border-neutral-medium font-medium">Gross Adjustment (%)</td>
            <td className="p-2 border-r border-neutral-medium"></td>
            {calculatedResults.map((result, index) => (
              <td key={index} className={`p-2 ${index < comparables.length - 1 ? 'border-r' : ''} border-neutral-medium worksheet-cell calculated`}>
                {formatPercentage(result.grossAdjustmentPercentage)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}