import { getToken } from "./auth-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const userApi = {
  getUser: async (id: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  searchUsers: async (query: string) => {
    const token = await getToken();
    const response = await fetch(
      `${API_URL}/users/search?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },
};
