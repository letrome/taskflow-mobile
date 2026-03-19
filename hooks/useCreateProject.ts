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

  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    startDate !== "" &&
    endDate !== "";

  const handleSubmit = async () => {
    if (!isFormValid) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const payload = {
        title: title.trim(),
        description: description.trim(),
        start_date: startDate,
        end_date: endDate,
        status: "active",
        members: [],
      };

      const response = await projectApi.createProject(payload);

      if (!response.ok) {
        throw new Error(response.data?.message || "Error creating project");
      }

      router.back();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
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
    isFormValid,
    error,
    handleSubmit,
  };
}
