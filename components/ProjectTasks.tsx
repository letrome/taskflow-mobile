import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Filter } from "lucide-react-native";
import { useCallback, useRef } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Task, TaskParams } from "@/types/task";
import TaskFilterSheet from "./TaskFilterSheet";
import TaskItem from "./TaskItem";

type ProjectTasksProps = Readonly<{
  tasks: readonly Task[];
  taskParams: TaskParams;
  setTaskParams: React.Dispatch<React.SetStateAction<TaskParams>>;
  projectTags: readonly { id: string; name: string }[];
  onViewTask?: (id: string) => void;
  header?: React.ReactNode;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}>;

export default function ProjectTasks({
  tasks,
  taskParams,
  setTaskParams,
  projectTags,
  onViewTask,
  header,
  isRefreshing = false,
  onRefresh,
}: ProjectTasksProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const hasActiveFilters =
    (taskParams.state?.length || 0) > 0 ||
    (taskParams.priority?.length || 0) > 0 ||
    (taskParams.tags?.length || 0) > 0 ||
    (taskParams.sort?.length || 0) > 0;

  return (
    <View className="flex-1">
      <FlatList
        data={tasks}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {header}
            <View className="flex-row justify-between items-center mb-4 mt-4">
              <Text className="text-xl font-bold text-foreground">Tasks</Text>
              <TouchableOpacity
                onPress={handlePresentModalPress}
                className={`flex-row items-center px-3 py-1.5 rounded-full border ${hasActiveFilters ? "border-primary bg-primary/10" : "border-border"}`}
              >
                <Filter
                  size={16}
                  className={
                    hasActiveFilters ? "text-primary" : "text-foreground"
                  }
                />
                <Text
                  className={`text-sm font-medium ml-1.5 ${hasActiveFilters ? "text-primary" : "text-foreground"}`}
                >
                  Filters & Sort {hasActiveFilters ? "(Active)" : ""}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TaskItem item={item} onViewTask={onViewTask} />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          <View className="py-8 items-center justify-center">
            <Text className="text-muted-foreground text-center">
              No tasks match the given criteria.
            </Text>
          </View>
        }
      />

      <TaskFilterSheet
        taskParams={taskParams}
        setTaskParams={setTaskParams}
        projectTags={projectTags}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </View>
  );
}
