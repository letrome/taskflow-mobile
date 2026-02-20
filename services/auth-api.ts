const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const authApi = {
  login: async (data: Record<string, unknown>) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  register: async (data: Record<string, unknown>) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },
};
