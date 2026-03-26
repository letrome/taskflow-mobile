import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { authApi } from "../../services/auth-api";
import { saveToken } from "../../services/auth-storage";

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const routeToRegister = () => {
    router.push(`/auth/register`);
  };

  const handleLogin = async () => {
    setError(null);

    try {
      const { ok, status, data } = await authApi.login(formData);

      if (ok && data.token) {
        await saveToken(data.token);
        router.replace("/(tabs)/projects");
      } else if (status === 401) {
        setError("Invalid credentials.");
      } else {
        setError(data.message || "An error occurred during login.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : JSON.stringify(err));
    }
  };

  return (
    <View className="flex-1 justify-center p-5 bg-background">
      <View className="bg-card p-6 rounded-3xl shadow-sm border border-border">
        <Text className="text-3xl font-bold text-foreground mb-6 text-center">
          Welcome Back
        </Text>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(val) => setFormData({ ...formData, email: val })}
          accessibilityLabel="Email"
          accessibilityHint="Enter your email address"
          className="border border-border rounded-xl mb-4 p-4 text-foreground bg-background text-base"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={(val) => setFormData({ ...formData, password: val })}
          accessibilityLabel="Password"
          accessibilityHint="Enter your password"
          className="border border-border rounded-xl mb-6 p-4 text-foreground bg-background text-base"
        />

        {error && (
          <View className="mb-4" accessibilityLiveRegion="polite">
            <Text className="text-red-500 text-center mb-2">{error}</Text>
          </View>
        )}

        <Pressable
          onPress={handleLogin}
          accessibilityRole="button"
          accessibilityLabel="Login"
          className="bg-primary p-4 rounded-2xl items-center shadow-sm"
        >
          <Text className="text-primary-foreground font-bold text-lg">
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={routeToRegister}
          accessibilityRole="link"
          accessibilityLabel="Don't have an account? Register"
          className="items-center mt-6 p-2"
        >
          <Text className="text-foreground text-base">
            {"Don't have an account? "}
            <Text className="text-primary font-bold">Register</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
