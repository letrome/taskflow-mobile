import { router } from "expo-router";
import { Activity, Briefcase, LogOut } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import UserProfile from "@/components/UserProfile";
import { useProjects } from "@/hooks/useProjects";
import { useUser } from "@/hooks/useUser";
import { deleteToken } from "@/services/auth-storage";

export default function ProfileScreen() {
  const { user, loading } = useUser();
  const { projects } = useProjects();

  const logout = useCallback(async () => {
    try {
      await deleteToken();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status.toLowerCase() === "active",
  ).length;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-5 pt-10 pb-8">
        <Text className="text-3xl font-bold text-foreground mb-8">Profile</Text>

        <View className="bg-card p-6 rounded-3xl shadow-sm border border-border mb-8">
          <UserProfile user={user} loading={loading} />
        </View>

        <Text className="text-xl font-bold text-foreground mb-4">
          Statistics
        </Text>

        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <View className="bg-primary/10 w-10 h-10 rounded-full items-center justify-center mb-3">
              <Briefcase size={20} color="#3b82f6" accessible={false} importantForAccessibility="no" />
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {totalProjects}
            </Text>
            <Text className="text-sm text-muted-foreground">
              Total Projects
            </Text>
          </View>

          <View className="flex-1 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <View className="bg-green-500/10 w-10 h-10 rounded-full items-center justify-center mb-3">
              <Activity size={20} color="#22c55e" accessible={false} importantForAccessibility="no" />
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {activeProjects}
            </Text>
            <Text className="text-sm text-muted-foreground">
              Active Projects
            </Text>
          </View>
        </View>

        <View className="mt-auto">
          <Pressable
            className="bg-card p-4 rounded-2xl border border-red-200 dark:border-red-900/30 flex-row items-center justify-center"
            onPress={logout}
            accessibilityRole="button"
            accessibilityLabel="Logout"
          >
            <LogOut size={20} color="#ef4444" />
            <Text className="text-red-500 font-bold text-lg ml-2">Logout</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
