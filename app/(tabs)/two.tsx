import { Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <Text className="text-2xl font-bold text-foreground mb-4">
        Second Tab
      </Text>
      <View className="bg-card w-full p-6 rounded-2xl shadow-sm border border-border">
        <Text className="text-card-foreground text-center">
          Second tab view testing the UI consistency.
        </Text>
      </View>
    </View>
  );
}
