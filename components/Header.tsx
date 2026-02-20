import { Text, View } from "react-native";

export default function Header({ value }: { value: string }) {
  return (
    <View className="flex-1 flex-col items-center justify-center bg-transparent">
      <Text className="text-xl font-bold capitalize text-foreground">
        {value}
      </Text>
    </View>
  );
}
