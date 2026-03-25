import { fireEvent, render } from '@testing-library/react-native';
import SearchableSelectionSheet from '../SearchableSelectionSheet';

// Mock lucide-react-native
jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return {
    Search: (props: any) => <View {...props} testID="search-icon" />,
    X: (props: any) => <View {...props} testID="x-icon" />,
  };
});

// Mock BottomSheet components
jest.mock('@gorhom/bottom-sheet', () => {
  const ReactMock = require('react');
  const { View, ScrollView } = require('react-native');
  return {
    BottomSheetModal: ReactMock.forwardRef((props: any, ref: any) => {
      ReactMock.useImperativeHandle(ref, () => ({
        present: jest.fn(),
        dismiss: jest.fn(),
      }));
      return <View testID="bottom-sheet-modal" accessibilityLabel="bottom-sheet-modal">{props.children}</View>;
    }),
    BottomSheetView: View,
    BottomSheetFlatList: (props: any) => (
      <ScrollView {...props}>
        {props.data.map((item: any) => (
          <View key={item.value}>{props.renderItem({ item })}</View>
        ))}
        {props.data.length === 0 && props.ListEmptyComponent}
      </ScrollView>
    ),
    BottomSheetBackdrop: (props: any) => <View {...props} testID="bottom-sheet-backdrop" />,
  };
});

describe('SearchableSelectionSheet', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];
  const mockOnSelect = jest.fn();

  it('renders and allows selection', () => {
    const mockRef = { current: { dismiss: jest.fn() } };
    const { getByText } = render(
      <SearchableSelectionSheet
        ref={mockRef as any}
        title="Search Title"
        options={mockOptions}
        selectedValue="1"
        onSelect={mockOnSelect}
      />
    );

    expect(getByText('Search Title')).toBeTruthy();
    expect(getByText('Option 1')).toBeTruthy();
    
    // Select Option 1 (using text)
    fireEvent.press(getByText('Option 1'));
    expect(mockOnSelect).toHaveBeenCalledWith('1');
    expect(mockRef.current.dismiss).toHaveBeenCalled();
  });

  it('filters results and shows empty state', () => {
    const mockRef = { current: { dismiss: jest.fn() } };
    const { getByPlaceholderText, queryByText, getByText } = render(
      <SearchableSelectionSheet
        ref={mockRef as any}
        title="Search Title"
        options={mockOptions}
        selectedValue="1"
        onSelect={mockOnSelect}
        placeholder="Filter..."
      />
    );

    const input = getByPlaceholderText('Filter...');
    fireEvent.changeText(input, 'Non-existent');
    
    expect(queryByText('Option 1')).toBeNull();
    expect(getByText('No results found')).toBeTruthy();
  });

  it('handles search input correctly and can clear it', () => {
    const mockRef = { current: { dismiss: jest.fn() } };
    const { getByPlaceholderText, getByDisplayValue, getByTestId, queryByDisplayValue } = render(
      <SearchableSelectionSheet
        ref={mockRef as any}
        title="Search Title"
        options={mockOptions}
        selectedValue="1"
        onSelect={mockOnSelect}
        placeholder="Filter..."
      />
    );

    const input = getByPlaceholderText('Filter...');
    fireEvent.changeText(input, 'Search query');
    expect(getByDisplayValue('Search query')).toBeTruthy();
    
    // Find the X clear button by testID
    const clearButton = getByTestId('clear-search-button');
    fireEvent.press(clearButton);
    expect(queryByDisplayValue('Search query')).toBeNull();
  });
});
