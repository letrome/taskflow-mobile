import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import type React from "react";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const TabIcon = ({ color }: { color: string }) => (
  <TabBarIcon name="code" color={color} />
);

const ParametersIcon = ({ color }: { color: string }) => (
  <TabBarIcon name="gear" color={color} />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: TabIcon,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: TabIcon,
        }}
      />
      <Tabs.Screen
        name="parameters"
        options={{
          title: "Parameters",
          tabBarIcon: ParametersIcon,
        }}
      />
    </Tabs>
  );
}
