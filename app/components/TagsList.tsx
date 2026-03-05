import { Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Tag = { id: string; name: string };

type TagsListProps = Readonly<{
  tags: readonly Tag[];
  onAddTag?: (name: string) => void;
  onDeleteTag?: (tagId: string) => void;
  editable?: boolean;
}>;

export default function TagsList({
  tags,
  onAddTag,
  onDeleteTag,
  editable = false,
}: TagsListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const handleAdd = () => {
    if (newTagName.trim() && onAddTag) {
      onAddTag(newTagName.trim());
    }
    setNewTagName("");
    setIsAdding(false);
  };
  if (!editable && (!tags || tags.length === 0)) return null;

  return (
    <View className="mb-8">
      <Text className="text-xl font-bold text-foreground mb-3">Tags</Text>
      <View className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <View className="flex-row flex-wrap -mt-2">
          {tags.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full mr-2 mt-2"
            >
              <Text className="text-primary text-sm font-medium">
                {item.name}
              </Text>
              {editable && onDeleteTag && (
                <Pressable
                  onPress={() => onDeleteTag(item.id)}
                  className="ml-2 bg-primary/20 rounded-full p-0.5"
                  hitSlop={8}
                >
                  <X size={12} className="text-primary" />
                </Pressable>
              )}
            </View>
          ))}

          {editable && (
            <View className="flex-row items-center mt-2">
              {isAdding ? (
                <View className="flex-row items-center bg-muted rounded-full px-3 py-0 border border-primary/30 h-8">
                  <TextInput
                    value={newTagName}
                    onChangeText={setNewTagName}
                    placeholder="New tag..."
                    onSubmitEditing={handleAdd}
                    autoFocus
                    className="text-sm min-w-[80px] h-full"
                    onBlur={() => {
                      if (!newTagName.trim()) setIsAdding(false);
                    }}
                  />
                </View>
              ) : (
                <Pressable
                  onPress={() => setIsAdding(true)}
                  className="flex-row items-center border border-dashed border-primary/30 px-3 py-1.5 rounded-full"
                >
                  <Plus size={14} className="text-primary mr-1" />
                  <Text className="text-primary text-sm font-medium">Add</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
