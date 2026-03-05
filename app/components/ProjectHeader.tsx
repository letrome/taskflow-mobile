import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import type { Project } from "@/types/project";
import SelectionSheet from "./SelectionSheet";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
];

type ProjectHeaderProps = Readonly<{
  project: Project;
  updateProject: (updates: Partial<Project>) => void;
  setProject: (project: Project) => void;
}>;

export default function ProjectHeader({
  project,
  updateProject,
  setProject,
}: ProjectHeaderProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleStatusChange = useCallback(
    (status: string) => {
      setProject({ ...project, status: status as Project["status"] });
      updateProject({ status: status as Project["status"] });
    },
    [project, setProject, updateProject],
  );

  const isActive = project.status.toLowerCase() === "active";

  return (
    <View className="mb-6 flex-row items-center justify-between">
      <TextInput
        value={project.title}
        className="text-3xl font-extrabold text-foreground tracking-tight flex-1"
        onChangeText={(title) => setProject({ ...project, title })}
        onBlur={() => updateProject({ title: project.title })}
      />
      {project.status && (
        <TouchableOpacity
          onPress={handlePresentModalPress}
          className="bg-primary/10 px-3 py-1 rounded-full ml-4"
        >
          <View
            className={`flex-row items-center px-2 py-1 rounded-md ${
              isActive ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <FontAwesome
              name={isActive ? "sitemap" : "archive"}
              size={12}
              color={isActive ? "#3b82f6" : "#64748b"}
            />
            <Text
              className={`ml-1 text-xs font-semibold ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {isActive ? "Active" : "Archived"}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <SelectionSheet
        ref={bottomSheetModalRef}
        title="Change Status"
        options={STATUS_OPTIONS}
        selectedValue={project.status}
        onSelect={handleStatusChange}
        snapPoints={["25%"]}
      />
    </View>
  );
}
