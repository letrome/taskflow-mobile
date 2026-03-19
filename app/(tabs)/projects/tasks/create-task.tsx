import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { View } from "react-native";
import CreateElementButton from "@/components/CreateElementButton";
import DatePickerField from "@/components/DatePickerField";
import FormInput from "@/components/FormInput";
import FormLayout from "@/components/FormLayout";
import FormSelection from "@/components/FormSelection";
import MultipleSelectionSheet from "@/components/MultipleSelectionSheet";
import SearchableSelectionSheet from "@/components/SearchableSelectionSheet";
import SelectionSheet from "@/components/SelectionSheet";
import { useCreateTask } from "@/hooks/useCreateTask";
import { TASK_PRIORITY_OPTIONS, TASK_STATE_OPTIONS } from "@/types/task";

export default function CreateTaskScreen() {
  const { projectId }: { projectId: string } = useLocalSearchParams();

  const {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    state,
    setState,
    assignee,
    setAssignee,
    tags,
    toggleTag,
    tagOptions,
    projectMembers,
    isLoadingProjectData,
    isSubmitting,
    isFormValid,
    error,
    handleSubmit,
  } = useCreateTask(projectId);

  // Bottom sheet refs
  const stateSheetRef = useRef<BottomSheetModal>(null);
  const prioritySheetRef = useRef<BottomSheetModal>(null);
  const tagsSheetRef = useRef<BottomSheetModal>(null);
  const assigneeSheetRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <FormLayout
        error={error}
        submitButton={
          <CreateElementButton
            onPress={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={!isFormValid}
            label="Create Task"
          />
        }
      >
        <View className="gap-y-4 mb-8">
          <FormInput
            label="Title"
            required
            placeholder="Ex: update favicon"
            value={title}
            onChangeText={setTitle}
          />

          <FormInput
            label="Description"
            required
            placeholder="Detailed description of the task"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <DatePickerField
            label="Due date *"
            date={dueDate}
            onChange={setDueDate}
          />

          <View className="flex-row gap-x-4">
            <FormSelection
              label="State"
              required
              containerClassName="flex-1 gap-y-2"
              value={TASK_STATE_OPTIONS.find((o) => o.value === state)?.label}
              onPress={() => stateSheetRef.current?.present()}
            />

            <FormSelection
              label="Priority"
              required
              containerClassName="flex-1 gap-y-2"
              value={
                TASK_PRIORITY_OPTIONS.find((o) => o.value === priority)?.label
              }
              onPress={() => prioritySheetRef.current?.present()}
            />
          </View>

          <FormSelection
            label="Assignee"
            value={(() => {
              if (!assignee) return null;
              const member = projectMembers.find((m) => m.id === assignee);
              return member
                ? `${member.first_name} ${member.last_name}`
                : "Unknown User";
            })()}
            placeholder="Select assignee"
            onPress={() => assigneeSheetRef.current?.present()}
          />

          <FormSelection
            label="Tags"
            value={tags.length > 0 ? `${tags.length} tag(s) selected` : null}
            placeholder={
              isLoadingProjectData ? "Loading tags..." : "Select tags"
            }
            onPress={() => tagsSheetRef.current?.present()}
            disabled={isLoadingProjectData}
          />
        </View>
      </FormLayout>

      <SelectionSheet
        ref={stateSheetRef}
        title="Select State"
        options={TASK_STATE_OPTIONS}
        selectedValue={state}
        onSelect={setState}
      />

      <SelectionSheet
        ref={prioritySheetRef}
        title="Select Priority"
        options={TASK_PRIORITY_OPTIONS}
        selectedValue={priority}
        onSelect={setPriority}
      />

      <SearchableSelectionSheet
        ref={assigneeSheetRef}
        title="Select Assignee"
        options={[
          { value: "", label: "Unassigned" },
          ...projectMembers.map((m) => ({
            value: m.id,
            label: `${m.first_name} ${m.last_name}`,
          })),
        ]}
        selectedValue={assignee}
        onSelect={setAssignee}
        placeholder="Filter members..."
      />

      <MultipleSelectionSheet
        ref={tagsSheetRef}
        title="Select Tags"
        options={tagOptions}
        selectedValues={tags}
        onSelect={toggleTag}
        snapPoints={["20%"]}
      />
    </>
  );
}
