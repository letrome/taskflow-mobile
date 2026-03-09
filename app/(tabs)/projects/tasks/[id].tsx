import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useTaskDetails } from "../../../../hooks/useTaskDetails";

export default function TaskDetailsScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const { task, setTask } = useTaskDetails(id);

    if (!task) {
      return (
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      );
    }
  return (
    <View>
      <Text>{task.title}</Text>
    </View>
  );
}