import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Search, X } from "lucide-react-native";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Option = Readonly<{
  value: string;
  label: string;
}>;

type SearchableSelectionSheetProps = Readonly<{
  title: string;
  options: readonly Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  snapPoints?: string[];
  placeholder?: string;
}>;

const SearchableSelectionSheet = forwardRef<
  BottomSheetModal,
  SearchableSelectionSheetProps
>(
  (
    {
      title,
      options,
      selectedValue,
      onSelect,
      snapPoints = ["60%", "90%"],
      placeholder = "Search...",
    },
    ref,
  ) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOptions = useMemo(() => {
      if (!searchQuery.trim()) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }, [options, searchQuery]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    const handleSelect = useCallback(
      (value: string) => {
        onSelect(value);
        (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
        setSearchQuery("");
      },
      [onSelect, ref],
    );

    const renderItem = useCallback(
      ({ item }: { item: Option }) => (
        <Pressable
          onPress={() => handleSelect(item.value)}
          className={`px-4 py-4 rounded-xl flex-row items-center mb-2 mx-4 ${
            selectedValue === item.value
              ? "bg-primary"
              : "bg-card border border-border"
          }`}
        >
          <View className="flex-1">
            <Text
              className={`text-base font-medium ${
                selectedValue === item.value
                  ? "text-primary-foreground"
                  : "text-foreground"
              }`}
            >
              {item.label}
            </Text>
          </View>
          {selectedValue === item.value && (
            <View className="h-2 w-2 rounded-full bg-primary-foreground" />
          )}
        </Pressable>
      ),
      [selectedValue, handleSelect],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        keyboardBehavior="extend"
      >
        <BottomSheetView className="flex-1">
          <View className="px-6 py-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-foreground">{title}</Text>
            <Pressable
              onPress={() =>
                (ref as React.RefObject<BottomSheetModal>).current?.dismiss()
              }
              className="p-2 bg-muted rounded-full"
            >
              <X size={20} className="text-muted-foreground" />
            </Pressable>
          </View>

          <View className="px-4 mb-4">
            <View className="flex-row items-center bg-muted rounded-xl px-4 py-2 border border-border">
              <Search size={18} className="text-muted-foreground mr-2" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={placeholder}
                className="flex-1 h-10 text-base"
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")} className="p-1">
                  <X size={16} className="text-muted-foreground" />
                </Pressable>
              )}
            </View>
          </View>

          <BottomSheetFlatList
            data={filteredOptions}
            keyExtractor={(item: Option) => item.value}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View className="py-10 items-center">
                <Text className="text-muted-foreground text-base">
                  No results found
                </Text>
              </View>
            }
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

SearchableSelectionSheet.displayName = "SearchableSelectionSheet";

export default SearchableSelectionSheet;
