import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { deleteToken } from "@/services/auth-storage";
import { projectApi } from "@/services/project-api";
import { taskApi } from "@/services/task-api";
import { userApi } from "@/services/user-api";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";

const fetchTask = async (id: string) => {
  const response = await taskApi.fetchTask(id);
  if (response.ok) {
    return response.data;
  }
  if (response.status === 401) {
    await deleteToken();
    router.replace("/auth/login");
  }
  return null;
};

const fetchProjectTags = async (projectId: string) => {
  const response = await projectApi.getProjectTags(projectId);
  if (response.ok) {
    return response.data;
  }
  return [];
};

export function useTaskDetails(id: string) {
  const [task, setTask] = useState<Task | null>(null);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [assigneeUser, setAssigneeUser] = useState<User | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadTaskAndTags = async () => {
        const data = await fetchTask(id);
        if (data) {
          setTask(data);

          if (data.assignee) {
            const userRes = await userApi.getUser(data.assignee);
            if (userRes.ok) {
              setAssigneeUser(userRes.data.user || userRes.data);
            }
          } else {
            setAssigneeUser(null);
          }

          if (data.project && data.tags && data.tags.length > 0) {
            const projectTags = await fetchProjectTags(data.project);

            const taskTagsDetails = data.tags.map((tagId: string) => {
              const found = projectTags.find(
                (pt: { id: string; name: string }) => pt.id === tagId,
              );
              return found
                ? { id: tagId, name: found.name }
                : { id: tagId, name: tagId };
            });

            setTags(taskTagsDetails);
          } else {
            setTags([]);
          }
        }
      };

      if (id) {
        loadTaskAndTags();
      }
    }, [id]),
  );

  const updateTask = async (updates: Partial<Task> = {}) => {
    if (!task) return;
    const updatedTask = { ...task, ...updates };

    const response = await taskApi.updateTask(id, {
      title: updatedTask.title,
      description: updatedTask.description,
      state: updatedTask.state,
      priority: updatedTask.priority,
      due_date: updatedTask.due_date,
      assignee: updatedTask.assignee,
    });

    if (response.ok) {
      const newData = response.data;
      setTask(newData);
      if (newData.assignee && newData.assignee !== assigneeUser?.id) {
        const userRes = await userApi.getUser(newData.assignee);
        if (userRes.ok) setAssigneeUser(userRes.data.user || userRes.data);
      } else if (!newData.assignee) {
        setAssigneeUser(null);
      }
    }
    if (response.status === 401) {
      await deleteToken();
      router.replace("/auth/login");
    }
  };

  const deleteCurrentTask = async () => {
    const response = await taskApi.deleteTask(id);
    if (response.ok) {
      router.back();
    }
    if (response.status === 401) {
      await deleteToken();
      router.replace("/auth/login");
    }
  };

  const addTag = async (tagId: string, name: string) => {
    const previousTags = [...tags];
    setTags((prev) => [...prev, { id: tagId, name }]);
    const response = await taskApi.addTaskTag(id, tagId);
    if (!response.ok) {
      setTags(previousTags);
    }
  };

  const removeTag = async (tagId: string) => {
    const previousTags = [...tags];
    setTags((prev) => prev.filter((t) => t.id !== tagId));

    const response = await taskApi.removeTaskTag(id, tagId);
    if (!response.ok) {
      setTags(previousTags);
    }
  };

  return {
    task,
    setTask,
    tags,
    assigneeUser,
    updateTask,
    deleteCurrentTask,
    addTag,
    removeTag,
  };
}
