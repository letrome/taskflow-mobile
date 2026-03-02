import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import type { Project } from "@/types/project";

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
    (status: Project["status"]) => {
      setProject({ ...project, status });
      updateProject({ status });
      bottomSheetModalRef.current?.dismiss();
    },
    [project, setProject, updateProject],
  );

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

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["25%"]}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1 p-6 items-center">
          <Text className="text-xl font-bold mb-6 text-foreground">
            Change Status
          </Text>
          <View className="flex-row gap-4 w-full justify-center">
            <TouchableOpacity
              onPress={() => handleStatusChange("ACTIVE")}
              className={`px-6 py-3 rounded-full flex-1 items-center ${project.status === "ACTIVE" ? "bg-primary" : "bg-primary/10"}`}
            >
              <Text
                className={`font-bold text-lg ${project.status === "ACTIVE" ? "text-primary-foreground" : "text-primary"}`}
              >
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleStatusChange("ARCHIVED")}
              className={`px-6 py-3 rounded-full flex-1 items-center ${project.status === "ARCHIVED" ? "bg-primary" : "bg-primary/10"}`}
            >
              <Text
                className={`font-bold text-lg ${project.status === "ARCHIVED" ? "text-primary-foreground" : "text-primary"}`}
              >
                Archived
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
