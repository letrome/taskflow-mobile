import { ScrollView, Text, TextInput, View } from "react-native";
import CreateElementButton from "@/app/components/CreateElementButton";
import DatePickerField from "@/app/components/DatePickerField";
import ErrorElement from "@/app/components/ErrorElement";
import { useCreateProject } from "@/hooks/useCreateProject";

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

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <View className="gap-y-4 mb-8">
          {/* Title */}
          <View className="gap-y-2">
            <Text className="text-sm font-medium text-muted-foreground">
              Title *
            </Text>
            <TextInput
              className="bg-muted text-foreground p-4 rounded-xl text-base"
              placeholder="Ex: website redesign"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View className="gap-y-2">
            <Text className="text-sm font-medium text-muted-foreground">
              Description *
            </Text>
            <TextInput
              className="bg-muted text-foreground p-4 rounded-xl text-base"
              placeholder="Ex: redesign the website"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Start date & End date */}
          <View className="flex-row gap-x-4">
            <DatePickerField
              label="Start date *"
              date={startDate}
              onChange={setStartDate}
              containerClassName="flex-1 gap-y-2"
            />
            <DatePickerField
              label="End date *"
              date={endDate}
              onChange={setEndDate}
              containerClassName="flex-1 gap-y-2"
            />
          </View>
        </View>

        {/* Error */}
        <ErrorElement error={error} />

        {/* Create project button */}
        <CreateElementButton
          onPress={handleSubmit}
          isSubmitting={isSubmitting}
          label="Create Project"
        />
      </View>
    </ScrollView>
  );
}
