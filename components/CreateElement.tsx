import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable } from "react-native";

type CreateElementProps = Readonly<{
  onPress: () => void;
  accessibilityLabel?: string;
}>;

export default function CreateElement({ onPress, accessibilityLabel = "Create new" }: CreateElementProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="absolute bottom-6 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg"
    >
      <FontAwesome name="plus" size={24} color="white" />
    </Pressable>
  );
}
