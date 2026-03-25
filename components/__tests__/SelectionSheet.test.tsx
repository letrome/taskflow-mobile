import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectionSheet from '../SelectionSheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

describe('SelectionSheet', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];
  const mockOnSelect = jest.fn();
  const mockRef: any = {
    current: {
      dismiss: jest.fn(),
    },
  };

  it('renders correctly', () => {
    const { getByText } = render(
      <BottomSheetModalProvider>
        <SelectionSheet
          ref={mockRef}
          title="Test Title"
          options={mockOptions}
          selectedValue="1"
          onSelect={mockOnSelect}
        />
      </BottomSheetModalProvider>
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('calls onSelect when an option is pressed', () => {
    const { getByText } = render(
      <BottomSheetModalProvider>
        <SelectionSheet
          ref={mockRef}
          title="Test Title"
          options={mockOptions}
          selectedValue="1"
          onSelect={mockOnSelect}
        />
      </BottomSheetModalProvider>
    );

    fireEvent.press(getByText('Option 2'));
    expect(mockOnSelect).toHaveBeenCalledWith('2');
    expect(mockRef.current.dismiss).toHaveBeenCalled();
  });
});
