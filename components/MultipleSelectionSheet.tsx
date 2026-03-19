import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Option = Readonly<{
  value: string;
  label: string;
}>;

type MultipleSelectionSheetProps = Readonly<{
  title: string;
  options: readonly Option[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  snapPoints?: string[];
}>;

const MultipleSelectionSheet = forwardRef<
  BottomSheetModal,
  MultipleSelectionSheetProps
>(({ title, options, selectedValues, onSelect, snapPoints = ["30%"] }, ref) => {
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

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className="flex-1 p-6 items-center">
        <Text className="text-xl font-bold mb-6 text-foreground">{title}</Text>
        <View className="flex-row gap-3 w-full justify-center flex-wrap">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => onSelect(option.value)}
                className={`px-5 py-3 rounded-full ${options.length <= 4 ? "flex-1" : ""} items-center ${
                  isSelected ? "bg-primary" : "bg-primary/10"
                }`}
              >
                <Text
                  className={`font-bold ${
                    isSelected ? "text-primary-foreground" : "text-primary"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

MultipleSelectionSheet.displayName = "MultipleSelectionSheet";

export default MultipleSelectionSheet;
