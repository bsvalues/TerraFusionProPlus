import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import PropertyForm from "@/components/forms/property-form";

export default function PropertyFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  // If in edit mode, fetch the property data
  const { data: property, isLoading } = useQuery({
    queryKey: [`/api/properties/${id}`],
    enabled: isEditMode,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Property" : "Add New Property"}
      </h1>
      
      {isEditMode && isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <PropertyForm property={isEditMode ? property : undefined} />
      )}
    </div>
  );
}