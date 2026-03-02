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
      console.log(err);
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
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(val) => setFormData({ ...formData, email: val })}
          className="border border-border rounded-xl mb-4 p-4 text-foreground bg-background text-base"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={(val) => setFormData({ ...formData, password: val })}
          className="border border-border rounded-xl mb-6 p-4 text-foreground bg-background text-base"
        />

        {error && (
          <View className="mb-4">
            <Text className="text-red-500 text-center mb-2">{error}</Text>
            <Text className="text-[10px] text-gray-500 text-center">
              API: {process.env.EXPO_PUBLIC_API_URL}
            </Text>
          </View>
        )}

        <Pressable
          onPress={handleLogin}
          className="bg-primary p-4 rounded-2xl items-center shadow-sm"
        >
          <Text className="text-primary-foreground font-bold text-lg">
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/auth/register")}
          className="items-center mt-6 p-2"
        >
          <Text className="text-foreground text-base">
            Don't have an account?{" "}
            <Text className="text-primary font-bold">Register</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
