import { Text, View } from "react-native";

type ProjectOwnerProps = Readonly<{
  ownerName?: string | null;
}>;

export default function ProjectOwner({ ownerName }: ProjectOwnerProps) {
  if (!ownerName) return null;

  return (
    <View className="mt-4 pt-4 border-t border-border/50">
      <Text className="text-sm font-medium text-foreground">
        Created by:{" "}
        <Text className="text-muted-foreground font-normal">{ownerName}</Text>
      </Text>
    </View>
  );
}
