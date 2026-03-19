import { apiClient } from "./api-client";

export const taskApi = {
  fetchTask: (id: string) => {
    return apiClient.get(`/tasks/${id}`);
  },

  addTaskTag: (taskId: string, tagId: string) => {
    return apiClient.post(`/tasks/${taskId}/tags/${tagId}`);
  },

  removeTaskTag: (taskId: string, tagId: string) => {
    return apiClient.delete(`/tasks/${taskId}/tags/${tagId}`);
  },

  updateTask: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      state: string;
      priority: string;
      due_date: string;
      assignee: string | null;
    }>,
  ) => {
    return apiClient.patch(`/tasks/${id}`, data);
  },

  deleteTask: (id: string) => {
    return apiClient.delete(`/tasks/${id}`);
  },
};
