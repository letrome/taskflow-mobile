import { Text, View } from "react-native";
import type { Task } from "@/types/task";

type TaskItemProps = Readonly<{
  item: Task;
}>;

export default function TaskItem({ item }: TaskItemProps) {
  let statusColor = "bg-green-200";
  if (item.state === "OPEN") {
    statusColor = "bg-transparent";
  } else if (item.state === "IN_PROGRESS") {
    statusColor = "bg-yellow-200";
  }

  return (
    <View className="bg-card mb-3 p-4 rounded-xl border border-border/50 flex-row items-center shadow-sm">
      <View
        className={`w-4 h-4 rounded-full border border-primary mr-4 ${statusColor}`}
      />
      <View className="flex-1">
        <Text className="text-base font-medium">{item.title}</Text>
      </View>
    </View>
  );
}
