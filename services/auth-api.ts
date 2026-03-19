import { apiClient } from "./api-client";

export const authApi = {
  login: (data: Record<string, unknown>) => {
    return apiClient.post("/auth/login", data);
  },

  register: (data: Record<string, unknown>) => {
    return apiClient.post("/auth/register", data);
  },
};
