import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import CreateElementButton from "@/app/components/CreateElementButton";
import { useCreateTask } from "@/hooks/useCreateTask";
import { projectApi } from "../../../services/project-api";
import { TASK_PRIORITY_OPTIONS, TASK_STATE_OPTIONS } from "../../../types/task";
import DatePickerField from "../../components/DatePickerField";
import MultipleSelectionSheet from "../../components/MultipleSelectionSheet";
import SelectionSheet from "../../components/SelectionSheet";

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
    setTags,
    isSubmitting,
    error,
    handleSubmit,
  } = useCreateTask(projectId);

  const [tagOptions, setTagOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      try {
        const response = await projectApi.getProjectTags(projectId);
        if (response.ok && response.data) {
          const tags = response.data;
          setTagOptions(
            tags.map((tag: { id?: string; name?: string } | string) => {
              if (typeof tag === "string") {
                return { value: tag, label: tag };
              }
              return {
                value: tag.id || tag.name || "",
                label: tag.name || tag.id || "",
              };
            }),
          );
        }
      } catch (err) {
        console.error("Failed to fetch tags", err);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, [projectId]);

  // Bottom sheet refs
  const stateSheetRef = useRef<BottomSheetModal>(null);
  const prioritySheetRef = useRef<BottomSheetModal>(null);
  const tagsSheetRef = useRef<BottomSheetModal>(null);

  let tagsLabel = "Select tags";
  if (isLoadingTags) {
    tagsLabel = "Loading tags...";
  } else if (tags.length > 0) {
    tagsLabel = `${tags.length} tag(s) selected`;
  }

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
              placeholder="Ex: update favicon"
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
              placeholder="Detailed description of the task"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Due date */}
          <DatePickerField
            label="Due date *"
            date={dueDate}
            onChange={setDueDate}
          />

          {/* State & Priority row */}
          <View className="flex-row gap-x-4">
            <View className="flex-1 gap-y-2">
              <Text className="text-sm font-medium text-muted-foreground">
                State *
              </Text>
              <Pressable
                className={`p-4 rounded-xl border ${state ? "bg-card border-primary/30" : "bg-muted border-transparent"}`}
                onPress={() => stateSheetRef.current?.present()}
              >
                <Text
                  className={`text-base ${state ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {TASK_STATE_OPTIONS.find((o) => o.value === state)?.label ??
                    "Select"}
                </Text>
              </Pressable>
            </View>

            <View className="flex-1 gap-y-2">
              <Text className="text-sm font-medium text-muted-foreground">
                Priority *
              </Text>
              <Pressable
                className={`p-4 rounded-xl border ${priority ? "bg-card border-primary/30" : "bg-muted border-transparent"}`}
                onPress={() => prioritySheetRef.current?.present()}
              >
                <Text
                  className={`text-base ${priority ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {TASK_PRIORITY_OPTIONS.find((o) => o.value === priority)
                    ?.label ?? "Select"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Assignee */}
          <View className="gap-y-2">
            <Text className="text-sm font-medium text-muted-foreground">
              Assignee
            </Text>
            <TextInput
              className="bg-muted text-foreground p-4 rounded-xl text-base"
              placeholder="Ex: John Doe"
              value={assignee}
              onChangeText={setAssignee}
            />
          </View>

          {/* Tags */}
          <View className="gap-y-2">
            <Text className="text-sm font-medium text-muted-foreground">
              Tags
            </Text>
            <Pressable
              className={`p-4 rounded-xl border ${tags.length > 0 ? "bg-card border-primary/30" : "bg-muted border-transparent"}`}
              onPress={() => tagsSheetRef.current?.present()}
              disabled={isLoadingTags}
            >
              <Text
                className={`text-base ${tags.length > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                {tagsLabel}
              </Text>
            </Pressable>
          </View>
        </View>

        {error ? (
          <View className="bg-red-500/10 p-4 rounded-xl mb-6 border border-red-500/20">
            <Text className="text-red-500 font-medium text-center">
              {error}
            </Text>
          </View>
        ) : null}

        <CreateElementButton
          onPress={handleSubmit}
          isSubmitting={isSubmitting}
          label="Create task"
        />
      </View>

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

      <MultipleSelectionSheet
        ref={tagsSheetRef}
        title="Select Tags"
        options={tagOptions}
        selectedValues={tags}
        onSelect={(value) => {
          if (tags.includes(value)) {
            setTags(tags.filter((t) => t !== value));
          } else {
            setTags([...tags, value]);
          }
        }}
        snapPoints={["20%"]}
      />
    </ScrollView>
  );
}
