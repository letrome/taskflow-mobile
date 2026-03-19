import { Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { userApi } from "@/services/user-api";
import type { User } from "@/types/user";

type ProjectMembersListProps = Readonly<{
  projectMembers: readonly User[];
  onAddProjectMember?: (user: User) => void;
  onDeleteProjectMember?: (userId: string) => void;
  editable?: boolean;
}>;

export default function ProjectMembersList({
  projectMembers,
  onAddProjectMember,
  onDeleteProjectMember,
  editable = false,
}: ProjectMembersListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await userApi.searchUsers(text);
      if (response.ok && Array.isArray(response.data)) {
        // Filter out existing members
        const existingIds = new Set(projectMembers.map((m) => m.id));
        const filtered = response.data.filter(
          (u: User) => !existingIds.has(u.id),
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      console.error(e);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user: User) => {
    if (onAddProjectMember) {
      onAddProjectMember(user);
    }
    setSearchQuery("");
    setSearchResults([]);
    setIsAdding(false);
  };
  if (!editable && (!projectMembers || projectMembers.length === 0))
    return null;
  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <Text className="text-muted-foreground text-sm p-3 text-center">
          Searching...
        </Text>
      );
    }

    if (searchResults.length > 0) {
      return searchResults.map((user) => (
        <Pressable
          key={user.id}
          onPress={() => handleSelectUser(user)}
          className="p-3 border-b border-border/50 flex-row items-center"
        >
          <View className="h-8 w-8 rounded-full bg-primary/20 items-center justify-center mr-3">
            <Text className="text-primary font-bold text-xs">
              {user.first_name[0]}
              {user.last_name[0]}
            </Text>
          </View>
          <View>
            <Text className="text-foreground font-medium">
              {user.first_name} {user.last_name}
            </Text>
            <Text className="text-muted-foreground text-xs">{user.email}</Text>
          </View>
        </Pressable>
      ));
    }

    return (
      <Text className="text-muted-foreground text-sm p-3 text-center">
        No users found
      </Text>
    );
  };

  return (
    <View className="mb-8">
      <Text className="text-xl font-bold text-foreground mb-3">
        Project Members
      </Text>
      <View className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <View className="flex-row flex-wrap -mt-2">
          {projectMembers.map((item, index) => (
            <View
              key={item?.id ? item.id.toString() : `member-fallback-${index}`}
              className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full mr-2 mt-2"
            >
              <Text className="text-primary text-sm font-medium">
                {item.first_name} {item.last_name}
              </Text>
              {editable && onDeleteProjectMember && (
                <Pressable
                  onPress={() => onDeleteProjectMember(item.id)}
                  className="ml-2 bg-primary/20 rounded-full p-0.5"
                  hitSlop={8}
                >
                  <X size={12} className="text-primary" />
                </Pressable>
              )}
            </View>
          ))}

          {editable && (
            <View className="mt-2 w-full">
              {isAdding ? (
                <View className="w-full relative">
                  <View className="flex-row items-center bg-muted rounded-full px-3 py-0 border border-primary/30 h-10 w-full mb-2">
                    <TextInput
                      value={searchQuery}
                      onChangeText={handleSearch}
                      placeholder="Search for a user..."
                      autoFocus
                      className="text-sm flex-1 h-full"
                    />
                    <Pressable
                      onPress={() => {
                        setIsAdding(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="p-2"
                    >
                      <X size={16} className="text-muted-foreground" />
                    </Pressable>
                  </View>

                  {(searchResults.length > 0 ||
                    isSearching ||
                    searchQuery.trim().length > 0) && (
                    <View className="bg-card w-full rounded-xl border border-border shadow-sm overflow-hidden z-10 p-1">
                      {renderSearchResults()}
                    </View>
                  )}
                </View>
              ) : (
                <Pressable
                  onPress={() => setIsAdding(true)}
                  className="flex-row items-center border border-dashed border-primary/30 px-3 py-1.5 rounded-full self-start"
                >
                  <Plus size={14} className="text-primary mr-1" />
                  <Text className="text-primary text-sm font-medium">
                    Add member
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
