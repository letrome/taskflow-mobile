import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCallback, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import type { Task } from "@/types/task";
import { TASK_PRIORITY_OPTIONS } from "@/types/task";
import type { User } from "@/types/user";
import SearchableSelectionSheet from "./SearchableSelectionSheet";
import SelectionSheet from "./SelectionSheet";

type TaskDetailsCardProps = Readonly<{
  task: Task;
  updateTask: (updates: Partial<Task>) => void;
  setTask: (task: Task) => void;
  assignee: User | null;
  projectMembers: User[];
}>;

export default function TaskDetailsCard({
  task,
  updateTask,
  setTask,
  assignee,
  projectMembers,
}: TaskDetailsCardProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const prioritySheetRef = useRef<BottomSheetModal>(null);
  const assigneeSheetRef = useRef<BottomSheetModal>(null);

  const onDateChange = (_event: unknown, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && task) {
      const isoDate = selectedDate.toISOString();
      setTask({ ...task, due_date: isoDate });
      updateTask({ due_date: isoDate });
    }
  };

  const handlePriorityChange = useCallback(
    (priority: string) => {
      setTask({ ...task, priority: priority as Task["priority"] });
      updateTask({ priority: priority as Task["priority"] });
    },
    [task, setTask, updateTask],
  );

  const handleAssigneeChange = useCallback(
    (userId: string) => {
      const newUserId = userId === "unassigned" ? null : userId;
      setTask({ ...task, assignee: newUserId });
      updateTask({ assignee: newUserId });
    },
    [task, setTask, updateTask],
  );

  const assigneeOptions = [
    { value: "unassigned", label: "Unassigned" },
    ...projectMembers.map((m) => ({
      value: m.id || `unknown-${Math.random()}`,
      label:
        m.first_name && m.last_name
          ? `${m.first_name} ${m.last_name}`
          : m.email || m.id || "Unknown User",
    })),
  ];

  const pickerDate = task.due_date ? new Date(task.due_date) : new Date();

  return (
    <View className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-8">
      <TextInput
        className="text-base text-muted-foreground leading-relaxed mb-4"
        value={task.description}
        onChangeText={(description) => setTask({ ...task, description })}
        onBlur={() => updateTask({ description: task.description })}
        placeholder="No description provided."
        multiline
      />

      <View className="flex-row items-center justify-between border-t border-border/50 pt-4 mt-2">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="flex-1"
        >
          <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
            Due Date
          </Text>
          <Text className="text-sm font-medium text-foreground">
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => assigneeSheetRef.current?.present()}
        >
          <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
            Assignee
          </Text>
          <Text className="text-sm font-medium text-foreground">
            {assignee
              ? `${assignee.first_name} ${assignee.last_name}`
              : "Unassigned"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-end"
          onPress={() => prioritySheetRef.current?.present()}
        >
          <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
            Priority
          </Text>
          <Text className="text-sm font-medium text-foreground">
            {TASK_PRIORITY_OPTIONS.find((o) => o.value === task.priority)
              ?.label ?? task.priority}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={pickerDate}
          mode="date"
          is24Hour={true}
          onChange={onDateChange}
        />
      )}

      <SelectionSheet
        ref={prioritySheetRef}
        title="Select Priority"
        options={[...TASK_PRIORITY_OPTIONS]}
        selectedValue={task.priority}
        onSelect={handlePriorityChange}
      />

      <SearchableSelectionSheet
        ref={assigneeSheetRef}
        title="Assign Task"
        options={assigneeOptions}
        selectedValue={task.assignee || "unassigned"}
        onSelect={handleAssigneeChange}
        placeholder="Filter members..."
      />
    </View>
  );
}
