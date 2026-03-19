import { Text, TouchableOpacity } from "react-native";

type FilterChipProps = Readonly<{
  label: string;
  isActive: boolean;
  onPress: () => void;
}>;

export default function FilterChip({
  label,
  isActive,
  onPress,
}: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
        isActive ? "bg-primary border-primary" : "bg-white/5 border-white/10"
      }`}
    >
      <Text
        className={`font-medium ${isActive ? "text-primary-foreground" : "text-white/70"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
