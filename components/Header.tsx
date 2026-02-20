import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";

export default function Header({ value }: { value: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
