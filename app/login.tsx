import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { authApi } from "../services/auth-api";
import { saveToken } from "../services/auth-storage";

export default function LoginScreen() {
  // Gestion des champs du formulaire
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State to handle error display
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null); // Reset error before attempt

    try {
      const { ok, status, data } = await authApi.login(formData);

      if (ok && data.token) {
        await saveToken(data.token);
        router.replace("/(tabs)");
      } else if (status === 401) {
        setError("Invalid credentials.");
      } else {
        setError(data.message || "An error occurred during login.");
      }
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : JSON.stringify(err));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(val) => setFormData({ ...formData, email: val })}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(val) => setFormData({ ...formData, password: val })}
        style={styles.input}
      />

      {error && (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={{ fontSize: 10, color: "gray", textAlign: "center" }}>
            API: {process.env.EXPO_PUBLIC_API_URL}
          </Text>
        </View>
      )}

      <Button title="Login" onPress={handleLogin} />

      <View style={{ marginTop: 20, gap: 10 }}>
        <Button
          title="Test Google (Public)"
          color="gray"
          onPress={async () => {
            try {
              const res = await fetch("https://www.google.com");
              alert(`Google Status: ${res.status}`);
            } catch (e: any) {
              alert(`Google Failed: ${e.message}`);
            }
          }}
        />
        <Button
          title="Test health (API)"
          color="gray"
          onPress={async () => {
            try {
              const url = `${process.env.EXPO_PUBLIC_API_URL}/health`;
              const res = await fetch(url);
              alert(`Health Status: ${res.status}`);
            } catch (e: any) {
              alert(
                `Health Failed: ${e.message} \nURL: ${process.env.EXPO_PUBLIC_API_URL}`,
              );
            }
          }}
        />
      </View>

      <Pressable onPress={() => router.replace("/register")}>
        <Text>Don't have an account? Register</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  errorText: { color: "red", marginBottom: 10, textAlign: "center" },
});
