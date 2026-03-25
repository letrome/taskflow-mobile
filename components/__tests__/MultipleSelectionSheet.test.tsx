import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MultipleSelectionSheet from '../MultipleSelectionSheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

describe('MultipleSelectionSheet', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];
  const mockOnSelect = jest.fn();

  it('renders correctly', () => {
    const { getByText } = render(
      <BottomSheetModalProvider>
        <MultipleSelectionSheet
          title="Multiple Title"
          options={mockOptions}
          selectedValues={['1']}
          onSelect={mockOnSelect}
        />
      </BottomSheetModalProvider>
    );

    expect(getByText('Multiple Title')).toBeTruthy();
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('calls onSelect when an unselected option is pressed', () => {
    const { getByText } = render(
      <BottomSheetModalProvider>
        <MultipleSelectionSheet
          title="Multiple Title"
          options={mockOptions}
          selectedValues={['1']}
          onSelect={mockOnSelect}
        />
      </BottomSheetModalProvider>
    );

    fireEvent.press(getByText('Option 2'));
    expect(mockOnSelect).toHaveBeenCalledWith('2');
  });

  it('calls onSelect when a selected option is pressed', () => {
    const { getByText } = render(
      <BottomSheetModalProvider>
        <MultipleSelectionSheet
          title="Multiple Title"
          options={mockOptions}
          selectedValues={['1', '2']}
          onSelect={mockOnSelect}
        />
      </BottomSheetModalProvider>
    );

    fireEvent.press(getByText('Option 1'));
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });
});
