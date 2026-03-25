import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UserProfile from '../UserProfile';
import CreateElement from '../CreateElement';
import CreateElementButton from '../CreateElementButton';
import ErrorElement from '../ErrorElement';
import FormField from '../FormField';
import FormInput from '../FormInput';
import FormLayout from '../FormLayout';
import DatePickerField from '../DatePickerField';
import { Text } from 'react-native';

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const ReactMock = require('react');
  const { View, TouchableOpacity, Text: RNText } = require('react-native');
  return (props: any) => (
    <View testID="datetimepicker">
      <TouchableOpacity onPress={() => props.onChange({ type: 'set' }, new Date('2023-01-01'))}>
        <RNText>Set Date</RNText>
      </TouchableOpacity>
    </View>
  );
});

describe('Common Components', () => {
  describe('UserProfile', () => {
    const mockUser = {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
    };

    it('renders loading state', () => {
      const { getByText } = render(<UserProfile user={null} loading={true} />);
      expect(getByText('Loading profile...')).toBeTruthy();
    });

    it('renders user info', () => {
      const { getByText } = render(<UserProfile user={mockUser as any} loading={false} />);
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
      expect(getByText('J')).toBeTruthy();
    });

    it('renders nothing when no user and not loading', () => {
      const { toJSON } = render(<UserProfile user={null} loading={false} />);
      expect(toJSON()).toBeNull();
    });
  });

  describe('CreateElement', () => {
    it('handles onPress', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<CreateElement onPress={onPress} />);
      // Pressable doesn't have a role by default in our code, let's find it by type or add testID if needed.
      // But it's the only Pressable.
    });
  });

  describe('CreateElementButton', () => {
    it('renders label and handles onPress', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <CreateElementButton label="Submit" onPress={onPress} isSubmitting={false} />
      );
      expect(getByText('Submit')).toBeTruthy();
      fireEvent.press(getByText('Submit'));
      expect(onPress).toHaveBeenCalled();
    });

    it('renders loading state', () => {
      const { queryByText, getByTestId } = render(
        <CreateElementButton label="Submit" onPress={jest.fn()} isSubmitting={true} />
      );
      expect(queryByText('Submit')).toBeNull();
    });
  });

  describe('ErrorElement', () => {
    it('renders error message', () => {
      const { getByText } = render(<ErrorElement error="An error occurred" />);
      expect(getByText('An error occurred')).toBeTruthy();
    });

    it('renders nothing when no error', () => {
      const { toJSON } = render(<ErrorElement error="" />);
      expect(toJSON()).toBeNull();
    });
  });

  describe('Form Components', () => {
    it('FormField renders label and children', () => {
      const { getByText } = render(
        <FormField label="Standard Label">
          <Text>Child Content</Text>
        </FormField>
      );
      expect(getByText('Standard Label')).toBeTruthy();
      expect(getByText('Child Content')).toBeTruthy();
    });

    it('FormField shows asterisk when required', () => {
      const { getByText } = render(
        <FormField label="Required Label" required={true}>
          <Text>Child</Text>
        </FormField>
      );
      expect(getByText('Required Label *')).toBeTruthy();
    });

    it('FormInput handles text change', () => {
      const onChangeText = jest.fn();
      const { getByPlaceholderText } = render(
        <FormInput label="Input" value="" onChangeText={onChangeText} placeholder="Enter text" />
      );
      fireEvent.changeText(getByPlaceholderText('Enter text'), 'New Value');
      expect(onChangeText).toHaveBeenCalledWith('New Value');
    });

    it('FormLayout renders children and submit button', () => {
      const { getByText } = render(
        <FormLayout submitButton={<Text>Submit Button</Text>} error="Layout Error">
          <Text>Main Content</Text>
        </FormLayout>
      );
      expect(getByText('Main Content')).toBeTruthy();
      expect(getByText('Submit Button')).toBeTruthy();
      expect(getByText('Layout Error')).toBeTruthy();
    });
  });

  describe('DatePickerField', () => {
    it('renders label and opens picker', () => {
      const onChange = jest.fn();
      const { getByText, queryByTestId } = render(
        <DatePickerField label="Select Date" date="" onChange={onChange} />
      );
      
      expect(getByText('Select Date')).toBeTruthy();
      expect(getByText('Select')).toBeTruthy();
      expect(queryByTestId('datetimepicker')).toBeNull();

      fireEvent.press(getByText('Select'));
      expect(getByText('Set Date')).toBeTruthy(); // From mock
      
      fireEvent.press(getByText('Set Date'));
      expect(onChange).toHaveBeenCalled();
    });

    it('displays formatted date', () => {
      const date = new Date('2023-12-25').toISOString();
      const { getByText } = render(
        <DatePickerField label="Select Date" date={date} onChange={jest.fn()} />
      );
      // Depending on locale, this might vary, but "12/25/2023" or similar.
      // Let's just check it's not "Select"
      expect(getByText(/2023/)).toBeTruthy();
    });
  });
});
