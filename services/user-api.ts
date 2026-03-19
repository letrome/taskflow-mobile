import { apiClient } from "./api-client";

export const userApi = {
  getUser: (id: string) => {
    return apiClient.get(`/users/${id}`);
  },

  searchUsers: (query: string, projectId?: string) => {
    return apiClient.get("/users/search", {
      params: { query, projectId },
    });
  },
};
