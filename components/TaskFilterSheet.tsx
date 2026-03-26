import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FilterChip from "@/components/ui/FilterChip";
import type { TaskParams } from "@/types/task";
import { TASK_PRIORITY_OPTIONS, TASK_STATE_OPTIONS } from "@/types/task";

type TaskFilterSheetProps = Readonly<{
  taskParams: TaskParams;
  setTaskParams: React.Dispatch<React.SetStateAction<TaskParams>>;
  projectTags: readonly { id: string; name: string }[];
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}>;

export default function TaskFilterSheet({
  taskParams,
  setTaskParams,
  projectTags,
  bottomSheetModalRef,
}: TaskFilterSheetProps) {
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

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={["60%", "90%"]}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#1c1c1e" }} // adjust for your theme
      handleIndicatorStyle={{ backgroundColor: "#666" }}
      accessibilityViewIsModal
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold text-white mb-6">
          Filters & Sort
        </Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Sort by</Text>
          <View className="flex-row flex-wrap">
            <FilterChip
              label="State (A-Z)"
              isActive={taskParams.sort?.includes("state") ?? false}
              onPress={() =>
                setTaskParams((p) => ({
                  ...p,
                  sort: [p.sort?.[0] === "state" ? "-state" : "state"],
                }))
              }
            />
            <FilterChip
              label="State (Z-A)"
              isActive={taskParams.sort?.includes("-state") ?? false}
              onPress={() => setTaskParams((p) => ({ ...p, sort: ["-state"] }))}
            />
            <FilterChip
              label="Priority (High)"
              isActive={taskParams.sort?.includes("-priority") ?? false}
              onPress={() =>
                setTaskParams((p) => ({ ...p, sort: ["-priority"] }))
              }
            />
            <FilterChip
              label="Priority (Low)"
              isActive={taskParams.sort?.includes("priority") ?? false}
              onPress={() =>
                setTaskParams((p) => ({ ...p, sort: ["priority"] }))
              }
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">State</Text>
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
            Priority
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
            <Text className="text-lg font-semibold text-white mb-3">Tags</Text>
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
          accessibilityRole="button"
          accessibilityLabel="Reset all filters"
        >
          <Text className="text-primary-foreground font-bold text-base">
            Reset filters
          </Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
