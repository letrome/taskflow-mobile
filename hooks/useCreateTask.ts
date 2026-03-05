import { router } from "expo-router";
import { useState } from "react";
import { projectApi } from "@/services/project-api";

export function useCreateTask(projectId: string) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [state, setState] = useState("OPEN");
  const [assignee, setAssignee] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (!title || !description || !dueDate || !priority || !state) {
        setError("Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);
      setError("");

      const payload = {
        title,
        description,
        due_date: dueDate,
        priority,
        state,
        assignee: assignee || null,
        tags,
      };

      const response = await projectApi.createProjectTask(projectId, payload);

      if (!response.ok) {
        throw new Error(response.data?.message || "Error creating task");
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
    dueDate,
    setDueDate,
    priority,
    setPriority,
    state,
    setState,
    assignee,
    setAssignee,
    tags,
    setTags,
    isSubmitting,
    error,
    handleSubmit,
  };
}
