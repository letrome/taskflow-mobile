import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { authApi } from "../../services/auth-api";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async () => {
    setError(null);

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
      <View className="flex-1 justify-center p-5 bg-background">
        <View className="bg-card p-6 rounded-3xl shadow-sm border border-border items-center">
          <Text className="text-xl text-green-600 dark:text-green-400 font-bold mb-6 text-center">
            Account created successfully!
          </Text>
          <Pressable
            onPress={() => router.replace("/auth/login")}
            className="bg-primary p-4 rounded-2xl items-center shadow-sm w-full"
          >
            <Text className="text-primary-foreground font-bold text-lg">
              Go to Login
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center p-5 bg-background">
      <View className="bg-card p-6 rounded-3xl shadow-sm border border-border">
        <Text className="text-3xl font-bold text-foreground mb-6 text-center">
          Create Account
        </Text>
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#888"
          onChangeText={(val) => setFormData({ ...formData, first_name: val })}
          className="border border-border rounded-xl mb-4 p-4 text-foreground bg-background text-base"
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#888"
          onChangeText={(val) => setFormData({ ...formData, last_name: val })}
          className="border border-border rounded-xl mb-4 p-4 text-foreground bg-background text-base"
        />
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
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        <Pressable
          onPress={handleRegister}
          className="bg-primary p-4 rounded-2xl items-center shadow-sm"
        >
          <Text className="text-primary-foreground font-bold text-lg">
            Register
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/auth/login")}
          className="items-center mt-6 p-2"
        >
          <Text className="text-foreground text-base">
            Already have an account?{" "}
            <Text className="text-primary font-bold">Login</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
