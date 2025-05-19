import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import AppraisalForm from "@/components/forms/appraisal-form";

export default function AppraisalFormPage() {
  const { id, propertyId } = useParams();
  const isEditMode = Boolean(id);
  
  // If in edit mode, fetch the appraisal data
  const { data: appraisal, isLoading: appraisalLoading } = useQuery({
    queryKey: [`/api/appraisals/${id}`],
    enabled: isEditMode,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Appraisal" : "Create New Appraisal"}
      </h1>
      
      {isEditMode && appraisalLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AppraisalForm 
          appraisal={isEditMode ? appraisal : undefined} 
          propertyId={propertyId ? parseInt(propertyId) : undefined}
        />
      )}
    </div>
  );
}