import { Trash2 } from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";

type TaskDeleteProps = Readonly<{
  onDelete: () => void;
}>;

export default function TaskDelete({ onDelete }: TaskDeleteProps) {
  const handleDeletePress = () => {
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
        className="flex-row items-center justify-center bg-red-500/10 p-4 rounded-xl border border-red-500/20"
      >
        <Trash2 size={20} color="#ef4444" className="mr-2" />
        <Text className="text-red-500 font-bold text-base">Delete Task</Text>
      </TouchableOpacity>
    </View>
  );
}
