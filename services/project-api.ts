import { getToken } from "./auth-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const projectApi = {
  getProjects: async () => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  createProject: async (data: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    members: string[];
  }) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  getProject: async (id: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  updateProject: async (
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
    const token = await getToken();
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  createProjectTask: async (
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
    const token = await getToken();

    const { assignee, ...restData } = data;
    const payload = assignee === null ? restData : { ...restData, assignee };

    const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  getTasks: async (id: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/projects/${id}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  getProjectTags: async (id: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/projects/${id}/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  addProjectTag: async (projectId: string, name: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/projects/${projectId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  deleteTag: async (tagId: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/tags/${tagId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // For DELETE, there might not be a JSON response body
    let result = null;
    try {
      result = await response.json();
    } catch {
      // Ignore
    }
    return { ok: response.ok, status: response.status, data: result };
  },

  addProjectMember: async (id: string, user_id: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/projects/${id}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ members: [user_id] }),
    });
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  },

  deleteProjectMember: async (id: string, user_id: string) => {
    const token = await getToken();
    const response = await fetch(
      `${API_URL}/projects/${id}/members/${user_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // For DELETE, there might not be a JSON response body
    let result = null;
    try {
      result = await response.json();
    } catch {
      // Ignore
    }
    return { ok: response.ok, status: response.status, data: result };
  },
};
