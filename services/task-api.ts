import { getToken } from "./auth-storage";

export const taskApi = {
  fetchTask: async (id: string) => {
    const token = await getToken();
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/tasks/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    let result = null;
    try {
      result = await response.json();
    } catch (e) {
      console.warn("fetchTask JSON parse error", e);
    }
    return { ok: response.ok, status: response.status, data: result };
  },

  addTaskTag: async (taskId: string, tagId: string) => {
    const token = await getToken();
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/tasks/${taskId}/tags/${tagId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    let result = null;
    try {
      result = await response.json();
    } catch (e) {
      console.warn("addTaskTag JSON parse error", e);
    }
    return { ok: response.ok, status: response.status, data: result };
  },
  removeTaskTag: async (taskId: string, tagId: string) => {
    const token = await getToken();
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/tasks/${taskId}/tags/${tagId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    let result = null;
    try {
      result = await response.json();
    } catch (e) {
      console.warn("removeTaskTag JSON parse error", e);
    }
    return { ok: response.ok, status: response.status, data: result };
  },
  updateTask: async (
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
    const token = await getToken();
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/tasks/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );
    let result = null;
    try {
      result = await response.json();
    } catch (e) {
      console.warn("updateTask JSON parse error", e);
    }
    return { ok: response.ok, status: response.status, data: result };
  },
  deleteTask: async (id: string) => {
    const token = await getToken();
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    let result = null;
    try {
      result = await response.json();
    } catch {}
    return { ok: response.ok, status: response.status, data: result };
  },
};
