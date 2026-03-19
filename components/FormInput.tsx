import { TextInput } from "react-native";
import FormField from "./FormField";

type FormInputProps = Readonly<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  required?: boolean;
  containerClassName?: string;
}>;

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  numberOfLines,
  required,
  containerClassName,
}: FormInputProps) {
  return (
    <FormField
      label={label}
      required={required}
      containerClassName={containerClassName}
    >
      <TextInput
        className="bg-muted text-foreground p-4 rounded-xl text-base"
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
        value={value}
        onChangeText={onChangeText}
      />
    </FormField>
  );
}
