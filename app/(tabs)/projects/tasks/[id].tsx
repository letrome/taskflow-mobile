import { Stack, useLocalSearchParams } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TagsList from "@/app/components/TagsList";
import TaskDetailsCard from "@/app/components/TaskDetailsCard";
import TaskHeader from "@/app/components/TaskHeader";
import { useTaskDetails } from "@/hooks/useTaskDetails";
import { projectApi } from "@/services/project-api";
import { userApi } from "@/services/user-api";
import type { User } from "@/types/user";

export default function TaskDetailsScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const {
    task,
    setTask,
    tags,
    assigneeUser,
    updateTask,
    deleteCurrentTask,
    addTag,
    removeTag,
  } = useTaskDetails(id);

  const [projectMembers, setProjectMembers] = useState<User[]>([]);

  const [projectTagOptions, setProjectTagOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!task?.project) return;
      try {
        const [tagsRes, projectRes] = await Promise.all([
          projectApi.getProjectTags(task.project),
          projectApi.getProject(task.project),
        ]);

        if (tagsRes.ok && tagsRes.data) {
          setProjectTagOptions(
            tagsRes.data.map((t: { id?: string; name?: string } | string) => {
              if (typeof t === "string") return { value: t, label: t };
              return {
                value: t.id || t.name || "",
                label: t.name || t.id || "",
              };
            }),
          );
        }

        if (projectRes.ok && projectRes.data) {
          const memberIds = projectRes.data.members || [];
          if (memberIds.length > 0) {
            const userPromises = memberIds.map((memberId: string) =>
              userApi.getUser(memberId),
            );
            const userResponses = await Promise.all(userPromises);
            const fullMembers = userResponses
              .filter((res) => res.ok && res.data)
              .map((res) => (res.data.user || res.data) as User);
            setProjectMembers(fullMembers);
          } else {
            setProjectMembers([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project data", err);
      }
    };
    fetchProjectData();
  }, [task?.project]);

  const handleDeleteTask = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCurrentTask(),
        },
      ],
    );
  };

  const handleAddTag = async (name: string) => {
    if (!task?.project) return;
    let tagId: string | undefined = projectTagOptions.find(
      (t) => t.label.toLowerCase() === name.toLowerCase(),
    )?.value;

    if (!tagId) {
      const response = await projectApi.addProjectTag(task.project, name);
      if (response.ok && response.data) {
        tagId = response.data.id;
        // Optimization: push to options
        setProjectTagOptions((prev) => [
          ...prev,
          { value: response.data.id, label: response.data.name },
        ]);
      }
    }

    if (tagId) {
      addTag(tagId, name);
    }
  };

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Task details",
          headerRight: () => null,
        }}
      />
      <ScrollView className="flex-1 bg-background pt-8 px-4">
        <TaskHeader task={task} setTask={setTask} updateTask={updateTask} />
        <TaskDetailsCard
          task={task}
          setTask={setTask}
          updateTask={updateTask}
          assignee={assigneeUser}
          projectMembers={projectMembers}
        />

        <TagsList
          tags={tags}
          editable={true}
          onAddTag={handleAddTag}
          onDeleteTag={removeTag}
        />

        <View className="mt-8 mb-12">
          <TouchableOpacity
            onPress={handleDeleteTask}
            className="flex-row items-center justify-center bg-red-500/10 p-4 rounded-xl border border-red-500/20"
          >
            <Trash2 size={20} color="#ef4444" className="mr-2" />
            <Text className="text-red-500 font-bold text-base">
              Delete Task
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
