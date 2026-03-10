import { Text, View } from "react-native";
import type { User } from "@/types/user";

type UserProfileProps = {
  user: User | null;
  loading: boolean;
};

export default function UserProfile({ user, loading }: UserProfileProps) {
  if (loading) {
    return (
      <Text className="text-muted-foreground mb-4">Loading profile...</Text>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View className="items-center mb-8">
      <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
        <Text className="text-primary text-3xl font-bold">
          {user.first_name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text className="text-xl font-bold text-foreground">
        {user.first_name} {user.last_name}
      </Text>
      <Text className="text-muted-foreground">{user.email}</Text>
    </View>
  );
}
