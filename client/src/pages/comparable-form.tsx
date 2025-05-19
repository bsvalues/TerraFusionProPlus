import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import ComparableForm from "@/components/forms/comparable-form";

export default function ComparableFormPage() {
  const { appraisalId, comparableId } = useParams();
  const isEditMode = Boolean(comparableId);
  
  // If in edit mode, fetch the comparable data
  const { data: comparable, isLoading: comparableLoading } = useQuery({
    queryKey: [`/api/comparables/${comparableId}`],
    enabled: isEditMode,
  });

  // Validate appraisalId is available
  if (!appraisalId) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-muted-foreground">Appraisal ID is missing. Cannot add comparable property.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Comparable Property" : "Add Comparable Property"}
      </h1>
      
      {isEditMode && comparableLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ComparableForm 
          comparable={isEditMode ? comparable : undefined} 
          appraisalId={parseInt(appraisalId)}
        />
      )}
    </div>
  );
}