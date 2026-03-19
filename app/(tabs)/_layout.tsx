import { Tabs } from "expo-router";
import { Briefcase, User } from "lucide-react-native";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

const ProjectIcon = ({ color, size }: { color: string; size: number }) => (
  <Briefcase color={color} size={size} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <User color={color} size={size} />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          height: 60,
          paddingTop: 5,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ProjectIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
