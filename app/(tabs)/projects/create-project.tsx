import { View } from "react-native";
import CreateElementButton from "@/components/CreateElementButton";
import DatePickerField from "@/components/DatePickerField";
import FormInput from "@/components/FormInput";
import FormLayout from "@/components/FormLayout";
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
    isFormValid,
    error,
    handleSubmit,
  } = useCreateProject();

  return (
    <FormLayout
      error={error}
      submitButton={
        <CreateElementButton
          onPress={handleSubmit}
          isSubmitting={isSubmitting}
          disabled={!isFormValid}
          label="Create Project"
        />
      }
    >
      <View className="gap-y-4 mb-8">
        <FormInput
          label="Title"
          required
          placeholder="Ex: website redesign"
          value={title}
          onChangeText={setTitle}
        />

        <FormInput
          label="Description"
          required
          placeholder="Ex: redesign the website"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

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
    </FormLayout>
  );
}
