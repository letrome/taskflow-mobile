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

export default function RegisterScreen() {
  // Gestion des champs du formulaire
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  // État pour gérer l'affichage du succès ou des erreurs
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async () => {
    setError(null); // Reset de l'erreur avant la tentative

    try {
      const { ok, status, data } = await authApi.register(formData);

      if (ok) {
        setIsSuccess(true);
      } else if (status === 409) {
        setError("This email is already in use.");
      } else {
        setError(data.message || "An error occurred during registration.");
      }
    } catch (err) {
      console.log(err);
      setError("Unable to connect to the server.");
    }
  };

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <Text style={styles.successText}>Account created successfully!</Text>
        <Button title="Go to Login" onPress={() => router.replace("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        onChangeText={(val) => setFormData({ ...formData, first_name: val })}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        onChangeText={(val) => setFormData({ ...formData, last_name: val })}
        style={styles.input}
      />
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

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button title="Register" onPress={handleRegister} />

      <Pressable onPress={() => router.replace("/login")}>
        <Text>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  errorText: { color: "red", marginBottom: 10, textAlign: "center" },
  successText: {
    fontSize: 18,
    color: "green",
    marginBottom: 20,
    textAlign: "center",
  },
});
