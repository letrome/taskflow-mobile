import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { deleteToken } from "@/services/auth-storage";
import type { Task } from "@/types/task";
import { taskApi } from "@/services/task-api";

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

export function useTaskDetails(id: string) {
  const [task, setTask] = useState<Task | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadTask = async () => {
        const data = await fetchTask(id);
        if (data) setTask(data);
      };

      if (id) {
        loadTask();
      }
    }, [id]),
  );

  return {
    task,
    setTask,
  };
}
