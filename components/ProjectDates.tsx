import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Project } from "@/types/project";

type ProjectDatesProps = Readonly<{
  project: Project;
  setProject: (project: Project) => void;
  updateProject: (updates: Partial<Project>) => void;
}>;

export default function ProjectDates({
  project,
  setProject,
  updateProject,
}: ProjectDatesProps) {
  const [datePickerConfig, setDatePickerConfig] = useState<{
    show: boolean;
    type: "start" | "end";
  }>({ show: false, type: "start" });

  const onDateChange = (_event: unknown, selectedDate?: Date) => {
    setDatePickerConfig({ ...datePickerConfig, show: false });
    if (selectedDate && project) {
      const isoDate = selectedDate.toISOString();
      if (datePickerConfig.type === "start") {
        setProject({ ...project, start_date: isoDate });
        updateProject({ start_date: isoDate });
      } else {
        setProject({ ...project, end_date: isoDate });
        updateProject({ end_date: isoDate });
      }
    }
  };

  const activeDateString =
    datePickerConfig.type === "start" ? project.start_date : project.end_date;
  const pickerDate = activeDateString ? new Date(activeDateString) : new Date();

  return (
    <View className="flex-row items-center justify-between border-t border-border/50 pt-4 mt-2">
      <TouchableOpacity
        onPress={() => setDatePickerConfig({ show: true, type: "start" })}
      >
        <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
          Start Date
        </Text>
        <Text className="text-sm font-medium text-foreground">
          {project.start_date
            ? new Date(project.start_date).toLocaleDateString()
            : "-"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="items-end"
        onPress={() => setDatePickerConfig({ show: true, type: "end" })}
      >
        <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
          End Date
        </Text>
        <Text className="text-sm font-medium text-foreground">
          {project.end_date
            ? new Date(project.end_date).toLocaleDateString()
            : "-"}
        </Text>
      </TouchableOpacity>

      {datePickerConfig.show && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          is24Hour={true}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}
