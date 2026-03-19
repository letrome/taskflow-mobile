import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import ErrorElement from "./ErrorElement";

type FormLayoutProps = Readonly<{
  children: ReactNode;
  submitButton?: ReactNode;
  error?: string;
  keyboardVerticalOffset?: number;
}>;

export default function FormLayout({
  children,
  submitButton,
  error,
  keyboardVerticalOffset = Platform.OS === "ios" ? 100 : 0,
}: FormLayoutProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-6 flex-1">
          <View className="flex-1">{children}</View>

          {/* Error & Submit Button */}
          <View className="mt-auto pt-6">
            <ErrorElement error={error || ""} />
            {submitButton}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
