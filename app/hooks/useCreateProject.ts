import { router } from "expo-router";
import { useState } from "react";
import { projectApi } from "@/services/project-api";

export function useCreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (!title || !description || !startDate || !endDate) {
        setError("Veuillez remplir les champs obligatoires");
        return;
      }

      setIsSubmitting(true);
      setError("");

      const payload = {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        status: "active",
        members: [],
      };

      const response = await projectApi.createProject(payload);

      if (!response.ok) {
        throw new Error(response.data?.message || "Erreur lors de la création");
      }

      router.back();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue s'est produite",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isSubmitting,
    error,
    handleSubmit,
  };
}
