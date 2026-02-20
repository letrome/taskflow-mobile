import { StyleSheet, Text, Button } from "react-native";

import { View } from "@/components/Themed";
import { router } from "expo-router";
import { deleteToken } from "@/services/auth-storage";

const logout = async () => {
  try {
    await deleteToken();
    router.replace("/login");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <Text>Parameters</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});
