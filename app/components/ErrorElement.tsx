import { Text, View } from "react-native";

type ErrorElementProps = Readonly<{
  error: string;
}>;

export default function ErrorElement({ error }: ErrorElementProps) {
  if (!error) return null;

  return (
    <View className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6">
      <Text className="text-red-500 font-medium text-center">{error}</Text>
    </View>
  );
}
