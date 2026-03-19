import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import TagsList from "@/components/TagsList";
import TaskDelete from "@/components/TaskDelete";
import TaskDetailsCard from "@/components/TaskDetailsCard";
import TaskHeader from "@/components/TaskHeader";
import { useTaskDetails } from "@/hooks/useTaskDetails";

export default function TaskDetailsScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const {
    task,
    setTask,
    tags,
    projectMembers,
    assigneeUser,
    updateTask,
    deleteCurrentTask,
    addTag,
    removeTag,
  } = useTaskDetails(id);

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
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
        onAddTag={addTag}
        onDeleteTag={removeTag}
      />

      <TaskDelete onDelete={deleteCurrentTask} />
    </ScrollView>
  );
}
