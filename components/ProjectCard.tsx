import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, Text, View } from "react-native";
import type { Project } from "@/types/project";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "---";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "---";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "---";
  }
};

type ProjectCardProps = Readonly<{
  item: Project;
  onPress: (id: string) => void;
}>;

export default function ProjectCard({ item, onPress }: ProjectCardProps) {
  const isActive = item.status.toLowerCase() === "active";

  return (
    <Pressable
      onPress={() => onPress(item.id)}
      className="bg-card w-full p-5 mb-4 rounded-2xl shadow-sm border border-border"
    >
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-lg font-bold text-card-foreground flex-1 mr-2">
          {item.title}
        </Text>

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
      </View>

      <View className="flex-row items-center mb-2">
        <FontAwesome name="calendar" size={14} color="#6b7280" />
        <Text className="text-sm text-muted-foreground ml-2">
          {formatDate(item.start_date)} {"→"} {formatDate(item.end_date)}
        </Text>
      </View>

      <View className="flex-row items-center">
        <FontAwesome name="users" size={14} color="#6b7280" />
        <Text className="text-sm text-muted-foreground ml-2">
          {Array.isArray(item.members) ? item.members.length : 0} membre(s)
        </Text>
      </View>
    </Pressable>
  );
}
