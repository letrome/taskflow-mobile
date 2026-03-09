import { FlatList, Text, View } from "react-native";
import TaskItem from "./TaskItem";
import type { Task } from "@/types/task";

type TaskListProps = Readonly<{
  tasks: readonly Task[];
  onViewTask?: (id: string) => void;
}>;

export default function TaskList({ tasks, onViewTask }: TaskListProps) {
  return (
    <View className="flex-1">
      <Text className="text-xl font-bold text-foreground mb-4">Tasks</Text>
      <FlatList
        data={tasks}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => <TaskItem item={item} onViewTask={onViewTask} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="py-8 items-center justify-center">
            <Text className="text-muted-foreground text-center">
              No tasks available for this project.
            </Text>
          </View>
        }
      />
    </View>
  );
}
