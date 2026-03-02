import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCreateProject } from "../../hooks/useCreateProject";

export default function CreateProjectScreen() {
  const {
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isSubmitting,
    error,
    handleSubmit,
  } = useCreateProject();

  const [datePickerConfig, setDatePickerConfig] = useState<{
    show: boolean;
    type: "start" | "end";
  }>({ show: false, type: "start" });

  const onDateChange = (_event: unknown, selectedDate?: Date) => {
    setDatePickerConfig({ ...datePickerConfig, show: false });
    if (selectedDate) {
      const isoDate = selectedDate.toISOString();
      if (datePickerConfig.type === "start") {
        setStartDate(isoDate);
      } else {
        setEndDate(isoDate);
      }
    }
  };

  const activeDateString =
    datePickerConfig.type === "start" ? startDate : endDate;
  const pickerDate =
    activeDateString && activeDateString !== ""
      ? new Date(activeDateString)
      : new Date();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-3xl font-bold text-foreground mb-6">
          Nouveau projet
        </Text>

        {error ? (
          <View className="bg-destructive/10 p-4 rounded-xl mb-6">
            <Text className="text-destructive font-medium">{error}</Text>
          </View>
        ) : null}

        <View className="gap-y-4 mb-8">
          <View className="gap-y-2">
            <Text className="text-sm font-medium text-muted-foreground">
              Titre *
            </Text>
            <TextInput
              className="bg-muted text-foreground p-4 rounded-xl text-base"
              placeholder="Ex: Refonte du site web"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="gap-y-2">
            <Text className="text-sm font-medium text-muted-foreground">
              Description *
            </Text>
            <TextInput
              className="bg-muted text-foreground p-4 rounded-xl text-base"
              placeholder="Description détaillée du projet..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View className="flex-row gap-x-4">
            <View className="flex-1 gap-y-2">
              <Text className="text-sm font-medium text-muted-foreground">
                Date de début *
              </Text>
              <Pressable
                className={`p-4 rounded-xl border ${startDate ? "bg-card border-primary/30" : "bg-muted border-transparent"}`}
                onPress={() =>
                  setDatePickerConfig({ show: true, type: "start" })
                }
              >
                <Text
                  className={`text-base ${startDate ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {startDate
                    ? new Date(startDate).toLocaleDateString()
                    : "Sélectionner"}
                </Text>
              </Pressable>
            </View>

            <View className="flex-1 gap-y-2">
              <Text className="text-sm font-medium text-muted-foreground">
                Date de fin *
              </Text>
              <Pressable
                className={`p-4 rounded-xl border ${endDate ? "bg-card border-primary/30" : "bg-muted border-transparent"}`}
                onPress={() => setDatePickerConfig({ show: true, type: "end" })}
              >
                <Text
                  className={`text-base ${endDate ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {endDate
                    ? new Date(endDate).toLocaleDateString()
                    : "Sélectionner"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {datePickerConfig.show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={pickerDate}
            mode="date"
            is24Hour={true}
            onChange={onDateChange}
          />
        )}

        <Pressable
          className={`flex-row justify-center items-center py-4 rounded-full ${
            isSubmitting ? "bg-primary/70" : "bg-primary"
          }`}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-primary-foreground font-bold text-lg">
              Créer le projet
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
