import { getToken } from "./auth-storage";

export const taskApi = {
    fetchTask: async (id: string) => {
        const token = await getToken();
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        return { ok: response.ok, status: response.status, data: result };
    },

    addTaskTag: async (taskId: string, tagId: string) => {
        const token = await getToken();
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks/${taskId}/tags/${tagId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        return { ok: response.ok, status: response.status, data: result };
    },
    removeTaskTag: async (taskId: string, tagId: string) => {
        const token = await getToken();
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks/${taskId}/tags/${tagId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json();
        return { ok: response.ok, status: response.status, data: result };
    },
}