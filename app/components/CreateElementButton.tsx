import { ActivityIndicator, Pressable, Text } from "react-native";

type CreateElementButtonProps = Readonly<{
  onPress: () => void;
  isSubmitting: boolean;
  label: string;
}>;

export default function CreateElementButton({
  onPress,
  isSubmitting,
  label,
}: CreateElementButtonProps) {
  return (
    <Pressable
      className={`flex-row justify-center items-center py-4 rounded-full ${
        isSubmitting ? "bg-primary/70" : "bg-primary"
      }`}
      onPress={onPress}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-primary-foreground font-bold text-lg">
          {label}
        </Text>
      )}
    </Pressable>
  );
}
