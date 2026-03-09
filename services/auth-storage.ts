import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { TOKEN_KEY } from "../constants/StorageKeys";

export const saveToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token", error);
  }
};

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token", error);
    return null;
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error deleting token", error);
  }
};

export const decodeToken = (token: string) => {
  try {
    return jwtDecode<{
      id?: string;
      sub?: string;
      userId?: string;
      [key: string]: unknown;
    }>(token);
  } catch (e) {
    console.error("Error decoding token", e);
    return null;
  }
};

export const getCurrentUserId = async () => {
  const token = await getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  // Support both typical JWT formats (sub or id)
  return decoded?.id || decoded?.sub || decoded?.userId || null;
};
