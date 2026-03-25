import { TouchableOpacity, Text } from "react-native";
import FormField from "./FormField";

type FormSelectionProps = Readonly<{
  label: string;
  value: string | null | undefined;
  onPress: () => void;
  placeholder?: string;
  required?: boolean;
  containerClassName?: string;
  disabled?: boolean;
}>;

export default function FormSelection({
  label,
  value,
  onPress,
  placeholder = "Select",
  required,
  containerClassName,
  disabled,
}: FormSelectionProps) {
  const hasValue = !!value;
  
  return (
    <FormField
      label={label}
      required={required}
      containerClassName={containerClassName}
    >
      <TouchableOpacity
        testID="form-selection-pressable"
        activeOpacity={0.7}
        className={`p-4 rounded-xl border ${
          hasValue ? "bg-card border-primary/30" : "bg-muted border-transparent"
        }`}
        onPress={onPress}
        disabled={disabled}
      >
        <Text
          className={`text-base ${
            hasValue ? "text-foreground font-medium" : "text-muted-foreground"
          }`}
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    </FormField>
  );
}
