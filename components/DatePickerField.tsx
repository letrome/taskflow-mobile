import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import FormField from "./FormField";

type DatePickerFieldProps = Readonly<{
  label: string;
  date: string;
  onChange: (date: string) => void;
  containerClassName?: string;
}>;

export default function DatePickerField({
  label,
  date,
  onChange,
  containerClassName,
}: DatePickerFieldProps) {
  const [show, setShow] = useState(false);

  const onDateChange = (_event: unknown, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate.toISOString());
    }
  };

  const pickerDate = date && date !== "" ? new Date(date) : new Date();

  return (
    <FormField
      label={label.replace(" *", "")}
      required={label.includes("*")}
      containerClassName={containerClassName}
    >
      <Pressable
        className={`p-4 rounded-xl border ${
          date ? "bg-card border-primary/30" : "bg-muted border-transparent"
        }`}
        onPress={() => setShow(true)}
      >
        <Text
          className={`text-base ${
            date ? "text-foreground font-medium" : "text-muted-foreground"
          }`}
        >
          {date ? new Date(date).toLocaleDateString() : "Select"}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          is24Hour={true}
          onChange={onDateChange}
        />
      )}
    </FormField>
  );
}
