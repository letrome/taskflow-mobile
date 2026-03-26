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

type SelectionSheetProps = Readonly<{
  title: string;
  options: readonly Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  snapPoints?: string[];
}>;

const SelectionSheet = forwardRef<BottomSheetModal, SelectionSheetProps>(
  ({ title, options, selectedValue, onSelect, snapPoints = ["30%"] }, ref) => {
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

    const handleSelect = (value: string) => {
      onSelect(value);
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        accessibilityViewIsModal
      >
        <BottomSheetView className="flex-1 p-6 items-center">
          <Text className="text-xl font-bold mb-6 text-foreground">
            {title}
          </Text>
          <View className="flex-row gap-3 w-full justify-center flex-wrap">
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelect(option.value)}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{ checked: selectedValue === option.value }}
                className={`px-5 py-3 rounded-full flex-1 items-center ${
                  selectedValue === option.value
                    ? "bg-primary"
                    : "bg-primary/10"
                }`}
              >
                <Text
                  className={`font-bold ${
                    selectedValue === option.value
                      ? "text-primary-foreground"
                      : "text-primary"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

SelectionSheet.displayName = "SelectionSheet";

export default SelectionSheet;
