import { Trash2 } from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";

type TaskDeleteProps = Readonly<{
  onDelete: () => void;
  isDeleting?: boolean;
}>;

export default function TaskDelete({ onDelete, isDeleting = false }: TaskDeleteProps) {
  const handleDeletePress = () => {
    if (isDeleting) return;
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ],
    );
  };

  return (
    <View className="mt-8 mb-12">
      <TouchableOpacity
        onPress={handleDeletePress}
        disabled={isDeleting}
        accessibilityRole="button"
        accessibilityLabel={isDeleting ? "Deleting task…" : "Delete Task"}
        accessibilityState={{ disabled: isDeleting }}
        className={`flex-row items-center justify-center p-4 rounded-xl border ${
          isDeleting
            ? "bg-muted border-border"
            : "bg-red-500/10 border-red-500/20"
        }`}
      >
        <Trash2 size={20} color={isDeleting ? "#94a3b8" : "#ef4444"} className="mr-2" />
        <Text className={`${isDeleting ? "text-muted-foreground" : "text-red-500"} font-bold text-base`}>
          {isDeleting ? "Deleting..." : "Delete Task"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
