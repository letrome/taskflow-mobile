import { router } from "expo-router";
import { deleteToken, getToken } from "./auth-storage";

const getApiUrl = () => process.env.EXPO_PUBLIC_API_URL || '';

type ApiRequestOptions = RequestInit & {
  params?: Record<string, string | string[] | undefined>;
};

export const apiClient = {
  async request(endpoint: string, options: ApiRequestOptions = {}) {
    const { params, headers, ...restOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const token = await getToken();

    const fetchOptions: RequestInit = {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };

    try {
      const response = await fetch(url, fetchOptions);

      if (response.status === 401) {
        await deleteToken();
        router.replace("/auth/login");
        return { ok: false, status: 401, data: null };
      }

      const data = await this.parseResponse(response);

      return {
        ok: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error(`API Request failed for ${url}:`, error);
      return { ok: false, status: 500, data: null };
    }
  },

  buildUrl(
    endpoint: string,
    params?: Record<string, string | string[] | undefined>,
  ): string {
    const url = `${getApiUrl()}${endpoint}`;
    if (!params) return url;

    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            queryParams.append(key, value.join(","));
          }
        } else {
          queryParams.append(key, value);
        }
      }
    }
    const queryString = queryParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  },

  async parseResponse(response: Response) {
    if (response.status === 204) return null;
    try {
      return await response.json();
    } catch {
      return null;
    }
  },

  get(endpoint: string, options: ApiRequestOptions = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  },

  post(endpoint: string, body?: unknown, options: ApiRequestOptions = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put(endpoint: string, body?: unknown, options: ApiRequestOptions = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch(endpoint: string, body?: unknown, options: ApiRequestOptions = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete(endpoint: string, options: ApiRequestOptions = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  },
};
