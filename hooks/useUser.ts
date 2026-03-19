import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { getCurrentUserId } from "@/services/auth-storage";
import { userApi } from "@/services/user-api";
import type { User } from "@/types/user";

export function useUser(id?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const userId = id || (await getCurrentUserId());

          if (!userId) {
            setLoading(false);
            return;
          }

          const response = await userApi.getUser(userId);

          if (response.ok) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Error in useUser hook:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, [id]),
  );

  return {
    user,
    loading,
  };
}
