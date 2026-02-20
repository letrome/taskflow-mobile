import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getToken } from "../services/auth-storage";

export default function Index() {
  const [isChecked, setIsChecked] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        setIsSignedIn(!!token);
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setIsChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!isChecked) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#CB6542" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
