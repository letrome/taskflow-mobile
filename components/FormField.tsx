import type { ReactNode } from "react";
import { Text, View } from "react-native";

type FormFieldProps = Readonly<{
  label: string;
  children: ReactNode;
  containerClassName?: string;
  required?: boolean;
}>;

export default function FormField({
  label,
  children,
  containerClassName,
  required,
}: FormFieldProps) {
  return (
    <View className={containerClassName || "gap-y-2"}>
      <Text className="text-sm font-medium text-muted-foreground">
        {label} {required ? "*" : ""}
      </Text>
      {children}
    </View>
  );
}
