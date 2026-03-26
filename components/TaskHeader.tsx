import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import type { Task } from "@/types/task";
import { TASK_STATE_OPTIONS } from "@/types/task";
import SelectionSheet from "./SelectionSheet";

type TaskHeaderProps = Readonly<{
  task: Task;
  updateTask: (updates: Partial<Task>) => void;
  setTask: (task: Task) => void;
}>;

export default function TaskHeader({
  task,
  updateTask,
  setTask,
}: TaskHeaderProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleStateChange = useCallback(
    (state: string) => {
      setTask({ ...task, state: state as Task["state"] });
      updateTask({ state: state as Task["state"] });
    },
    [task, setTask, updateTask],
  );

  const stateOption = TASK_STATE_OPTIONS.find((o) => o.value === task.state);
  const isActive = task.state === "IN_PROGRESS" || task.state === "OPEN";

  return (
    <View className="mb-6 flex-row items-center justify-between">
      <TextInput
        value={task.title}
        className="text-3xl font-extrabold text-foreground tracking-tight flex-1"
        onChangeText={(title) => setTask({ ...task, title })}
        onBlur={() => updateTask({ title: task.title })}
        accessibilityLabel="Task title"
      />
      {task.state && (
        <TouchableOpacity
          onPress={handlePresentModalPress}
          accessibilityRole="button"
          accessibilityLabel={`Task state: ${stateOption?.label ?? task.state}. Tap to change.`}
          className="bg-primary/10 px-3 py-1 rounded-full ml-4"
        >
          <View
            className={`flex-row items-center px-2 py-1 rounded-md ${
              isActive ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <FontAwesome
              name={isActive ? "check-circle-o" : "check-circle"}
              size={12}
              color={isActive ? "#3b82f6" : "#64748b"}
            />
            <Text
              className={`ml-1 text-xs font-semibold ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {stateOption?.label ?? task.state}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <SelectionSheet
        ref={bottomSheetModalRef}
        title="Change State"
        options={[...TASK_STATE_OPTIONS]}
        selectedValue={task.state}
        onSelect={handleStateChange}
        snapPoints={["25%"]}
      />
    </View>
  );
}
