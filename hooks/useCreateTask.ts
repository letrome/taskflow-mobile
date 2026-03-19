import { router } from "expo-router";
import { useEffect, useState } from "react";
import { projectApi } from "@/services/project-api";
import { userApi } from "@/services/user-api";
import type { User } from "@/types/user";

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

  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [tagOptions, setTagOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingProjectData, setIsLoadingProjectData] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;
      setIsLoadingProjectData(true);
      try {
        const [tagsRes, projectRes] = await Promise.all([
          projectApi.getProjectTags(projectId),
          projectApi.getProject(projectId),
        ]);

        if (tagsRes.ok && tagsRes.data) {
          setTagOptions(
            tagsRes.data
              .filter((tag: { id?: string; name?: string } | string) => {
                if (typeof tag === "string") return tag.trim() !== "";
                return (
                  (tag.id && tag.id.trim() !== "") ||
                  (tag.name && tag.name.trim() !== "")
                );
              })
              .map((tag: { id?: string; name?: string } | string) => {
                if (typeof tag === "string") {
                  return { value: tag, label: tag };
                }
                return {
                  value: tag.id || tag.name || "",
                  label: tag.name || tag.id || "",
                };
              }),
          );
        }

        if (projectRes.ok && projectRes.data) {
          const memberIds = projectRes.data.members || [];
          if (memberIds.length > 0) {
            const userPromises = memberIds.map((id: string) =>
              userApi.getUser(id),
            );
            const userResponses = await Promise.all(userPromises);
            const fullMembers = userResponses
              .filter(
                (res): res is { ok: true; data: Record<string, unknown> } =>
                  !!(res.ok && res.data),
              )
              .map((res) => {
                const data = res.data as { user?: User } & User;
                return data.user || data;
              });
            setProjectMembers(fullMembers);
          } else {
            setProjectMembers([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project data", err);
      } finally {
        setIsLoadingProjectData(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const toggleTag = (value: string) => {
    setTags((current) =>
      current.includes(value)
        ? current.filter((t) => t !== value)
        : [...current, value],
    );
  };

  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    dueDate !== "" &&
    priority !== "" &&
    state !== "";

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
    toggleTag,
    tagOptions,
    projectMembers,
    isLoadingProjectData,
    isSubmitting,
    isFormValid,
    error,
    handleSubmit,
  };
}
