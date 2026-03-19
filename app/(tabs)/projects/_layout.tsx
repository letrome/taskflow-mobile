import { Stack } from "expo-router";

export default function ProjectsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="tasks/create-task"
        options={{ headerShown: true, title: "New Task" }}
      />
      <Stack.Screen
        name="create-project"
        options={{ headerShown: true, title: "New Project" }}
      />
      <Stack.Screen name="tasks/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
