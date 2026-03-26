import { ActivityIndicator, Pressable, Text } from "react-native";

type CreateElementButtonProps = Readonly<{
  onPress: () => void;
  isSubmitting: boolean;
  label: string;
  disabled?: boolean;
}>;

export default function CreateElementButton({
  onPress,
  isSubmitting,
  label,
  disabled = false,
}: CreateElementButtonProps) {
  const isDisabled = isSubmitting || disabled;

  return (
    <Pressable
      className={`flex-row justify-center items-center py-4 rounded-full ${
        isDisabled ? "bg-muted border border-border" : "bg-primary"
      }`}
      onPress={onPress}
      disabled={isSubmitting}
      accessibilityRole="button"
      accessibilityLabel={isSubmitting ? "Loading…" : label}
      accessibilityState={{ disabled: isDisabled }}
    >
      {isSubmitting ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          className={`font-bold text-lg ${
            isDisabled ? "text-muted-foreground" : "text-primary-foreground"
          }`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
