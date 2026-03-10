import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import UserProfile from "@/app/components/UserProfile";
import { useUser } from "@/hooks/useUser";
import { deleteToken } from "@/services/auth-storage";

export default function TabThreeScreen() {
  const logout = async () => {
    try {
      await deleteToken();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const { user, loading } = useUser();

  return (
    <View className="flex-1 items-center justify-center p-5 bg-background">
      <Text className="text-2xl font-bold text-foreground mb-6">Settings</Text>
      <View className="bg-card w-full p-6 rounded-2xl shadow-sm border border-border items-center">
        <UserProfile user={user} loading={loading} />

        <Pressable
          className="bg-red-500 dark:bg-red-600 p-4 rounded-xl items-center w-full"
          onPress={logout}
        >
          <Text className="text-white font-bold text-lg">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
