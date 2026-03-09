import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Filter } from "lucide-react-native";
import { useCallback, useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import type { Task } from "@/types/task";
import { TASK_PRIORITY_OPTIONS, TASK_STATE_OPTIONS } from "@/types/task";
import TaskItem from "./TaskItem";

type TaskParams = {
  state?: string[];
  priority?: string[];
  tags?: string[];
  sort?: string[];
};

type TaskListProps = Readonly<{
  tasks: readonly Task[];
  taskParams: TaskParams;
  setTaskParams: React.Dispatch<React.SetStateAction<TaskParams>>;
  projectTags: readonly { id: string; name: string }[];
  onViewTask?: (id: string) => void;
}>;

function FilterChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
        isActive ? "bg-primary border-primary" : "bg-transparent border-input"
      }`}
    >
      <Text
        className={`font-medium ${isActive ? "text-primary-foreground" : "text-foreground"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function TaskList({
  tasks,
  taskParams,
  setTaskParams,
  projectTags,
  onViewTask,
}: TaskListProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const toggleArrayItem = (array: string[] | undefined, item: string) => {
    const current = array || [];
    if (current.includes(item)) {
      return current.filter((i) => i !== item);
    }
    return [...current, item];
  };

  const hasActiveFilters =
    (taskParams.state?.length || 0) > 0 ||
    (taskParams.priority?.length || 0) > 0 ||
    (taskParams.tags?.length || 0) > 0 ||
    (taskParams.sort?.length || 0) > 0;

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-foreground">Tasks</Text>
        <TouchableOpacity
          onPress={handlePresentModalPress}
          className={`flex-row items-center px-3 py-1.5 rounded-full border ${hasActiveFilters ? "border-primary bg-primary/10" : "border-border"}`}
        >
          <Filter
            size={16}
            className={hasActiveFilters ? "text-primary" : "text-foreground"}
          />
          <Text
            className={`text-sm font-medium ml-1.5 ${hasActiveFilters ? "text-primary" : "text-foreground"}`}
          >
            Objectifs & Tris {hasActiveFilters ? "(Actif)" : ""}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TaskItem item={item} onViewTask={onViewTask} />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="py-8 items-center justify-center">
            <Text className="text-muted-foreground text-center">
              No tasks match the given criteria.
            </Text>
          </View>
        }
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["60%", "90%"]}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#1c1c1e" }} // adjust for your theme
        handleIndicatorStyle={{ backgroundColor: "#666" }}
      >
        <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
          <Text className="text-2xl font-bold text-white mb-6">
            Filtrer & Trier
          </Text>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-white mb-3">
              Trier par
            </Text>
            <View className="flex-row flex-wrap">
              <FilterChip
                label="Statut (A-Z)"
                isActive={taskParams.sort?.includes("state") ?? false}
                onPress={
                  () =>
                    setTaskParams((p) => ({
                      ...p,
                      sort: [p.sort?.[0] === "state" ? "-state" : "state"],
                    })) /* Simple toggle for now, can be improved */
                }
              />
              <FilterChip
                label="Statut (Z-A)"
                isActive={taskParams.sort?.includes("-state") ?? false}
                onPress={() =>
                  setTaskParams((p) => ({ ...p, sort: ["-state"] }))
                }
              />
              <FilterChip
                label="Priorité (Haute)"
                isActive={taskParams.sort?.includes("-priority") ?? false}
                onPress={() =>
                  setTaskParams((p) => ({ ...p, sort: ["-priority"] }))
                }
              />
              <FilterChip
                label="Priorité (Basse)"
                isActive={taskParams.sort?.includes("priority") ?? false}
                onPress={() =>
                  setTaskParams((p) => ({ ...p, sort: ["priority"] }))
                }
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-white mb-3">
              Statut
            </Text>
            <View className="flex-row flex-wrap">
              {TASK_STATE_OPTIONS.map((state) => (
                <FilterChip
                  key={state.value}
                  label={state.label}
                  isActive={taskParams.state?.includes(state.value) ?? false}
                  onPress={() =>
                    setTaskParams((p) => ({
                      ...p,
                      state: toggleArrayItem(p.state, state.value),
                    }))
                  }
                />
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-white mb-3">
              Priorité
            </Text>
            <View className="flex-row flex-wrap">
              {TASK_PRIORITY_OPTIONS.map((priority) => (
                <FilterChip
                  key={priority.value}
                  label={priority.label}
                  isActive={
                    taskParams.priority?.includes(priority.value) ?? false
                  }
                  onPress={() =>
                    setTaskParams((p) => ({
                      ...p,
                      priority: toggleArrayItem(p.priority, priority.value),
                    }))
                  }
                />
              ))}
            </View>
          </View>

          {projectTags.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-white mb-3">
                Tags
              </Text>
              <View className="flex-row flex-wrap">
                {projectTags.map((tag) => (
                  <FilterChip
                    key={tag.id}
                    label={tag.name}
                    isActive={taskParams.tags?.includes(tag.id) ?? false}
                    onPress={() =>
                      setTaskParams((p) => ({
                        ...p,
                        tags: toggleArrayItem(p.tags, tag.id),
                      }))
                    }
                  />
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            className="bg-primary p-4 rounded-xl items-center mt-4 mb-8"
            onPress={() => setTaskParams({})}
          >
            <Text className="text-primary-foreground font-bold text-base">
              Réinitialiser les filtres
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
