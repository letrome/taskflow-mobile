import { apiClient } from "./api-client";

export const projectApi = {
  getProjects: () => {
    return apiClient.get("/projects");
  },

  createProject: (data: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    members: string[];
  }) => {
    return apiClient.post("/projects", data);
  },

  getProject: (id: string) => {
    return apiClient.get(`/projects/${id}`);
  },

  updateProject: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      start_date: string;
      end_date: string;
      status: string;
      members: string[];
    }>,
  ) => {
    return apiClient.put(`/projects/${id}`, data);
  },

  createProjectTask: (
    projectId: string,
    data: {
      title: string;
      description: string;
      due_date: string;
      priority: string;
      state: string;
      assignee: string | null;
      tags: string[];
    },
  ) => {
    const { assignee, ...restData } = data;
    const payload = assignee === null ? restData : { ...restData, assignee };
    return apiClient.post(`/projects/${projectId}/tasks`, payload);
  },

  getTasks: (
    id: string,
    params?: {
      state?: string[];
      priority?: string[];
      tags?: string[];
      sort?: string[];
    },
  ) => {
    return apiClient.get(`/projects/${id}/tasks`, { params });
  },

  getProjectTags: (id: string) => {
    return apiClient.get(`/projects/${id}/tags`);
  },

  addProjectTag: (projectId: string, name: string) => {
    return apiClient.post(`/projects/${projectId}/tags`, { name });
  },

  deleteTag: (tagId: string) => {
    return apiClient.delete(`/tags/${tagId}`);
  },

  addProjectMember: (id: string, user_id: string) => {
    return apiClient.post(`/projects/${id}/members`, { members: [user_id] });
  },

  deleteProjectMember: (id: string, user_id: string) => {
    return apiClient.delete(`/projects/${id}/members/${user_id}`);
  },
};
