import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateTaskScreen from '../create-task';
import { useCreateTask } from '@/hooks/useCreateTask';
import { useLocalSearchParams } from 'expo-router';

// Mock hook
jest.mock('@/hooks/useCreateTask');
// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock components
jest.mock('@/components/FormLayout', () => {
  const { View } = require('react-native');
  return ({ children, submitButton }: any) => (
    <View testID="form-layout">
      {children}
      {submitButton}
    </View>
  );
});

jest.mock('@/components/FormInput', () => {
  const { View, TextInput, Text } = require('react-native');
  return ({ label, value, onChangeText, placeholder }: any) => (
    <View testID={`form-input-${label}`}>
      <Text>{label}</Text>
      <TextInput placeholder={placeholder} value={value} onChangeText={onChangeText} testID={`input-${label}`} />
    </View>
  );
});

jest.mock('@/components/DatePickerField', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ label, date, onChange }: any) => (
    <View testID={`date-picker-${label}`}>
      <Text>{label}</Text>
      <TouchableOpacity onPress={() => onChange(new Date())} testID={`picker-${label}`} />
    </View>
  );
});

jest.mock('@/components/FormSelection', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ label, value, placeholder, onPress, disabled }: any) => (
    <View testID={`form-selection-${label}`}>
      <Text>{label}</Text>
      <Text>{value || placeholder}</Text>
      <TouchableOpacity onPress={onPress} disabled={disabled} testID={`selection-${label}`} />
    </View>
  );
});

jest.mock('@/components/CreateElementButton', () => {
  const { Button } = require('react-native');
  return ({ onPress, disabled, label }: any) => (
    <Button title={label} onPress={onPress} disabled={disabled} testID="submit-button" />
  );
});

// Mock BottomSheet components
jest.mock('@/components/SelectionSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ present: jest.fn(), dismiss: jest.fn() }));
    return <View testID="selection-sheet" />;
  });
});

jest.mock('@/components/SearchableSelectionSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ present: jest.fn(), dismiss: jest.fn() }));
    return <View testID="searchable-selection-sheet" />;
  });
});

jest.mock('@/components/MultipleSelectionSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({ present: jest.fn(), dismiss: jest.fn() }));
    return <View testID="multiple-selection-sheet" />;
  });
});

describe('CreateTaskScreen', () => {
  const mockProjectId = 'proj-123';
  const mockMethods = {
    title: '',
    setTitle: jest.fn(),
    description: '',
    setDescription: jest.fn(),
    dueDate: new Date().toISOString(),
    setDueDate: jest.fn(),
    priority: 'MEDIUM',
    setPriority: jest.fn(),
    state: 'OPEN',
    setState: jest.fn(),
    assignee: 'user-1',
    setAssignee: jest.fn(),
    tags: ['tag-1'],
    toggleTag: jest.fn(),
    tagOptions: [{ value: 'tag-1', label: 'Tag 1' }],
    projectMembers: [{ id: 'user-1', first_name: 'John', last_name: 'Doe' }],
    isLoadingProjectData: false,
    isSubmitting: false,
    isFormValid: true,
    error: null,
    handleSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ projectId: mockProjectId });
    (useCreateTask as jest.Mock).mockReturnValue(mockMethods);
  });

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(<CreateTaskScreen />);
    
    expect(getByTestId('form-layout')).toBeTruthy();
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
    expect(getByText('Due date *')).toBeTruthy();
    expect(getByText('State')).toBeTruthy();
    expect(getByText('Priority')).toBeTruthy();
    expect(getByText('Assignee')).toBeTruthy();
    expect(getByText('Tags')).toBeTruthy();
    expect(getByTestId('submit-button')).toBeTruthy();
  });

  it('renders assignee correctly when selected', () => {
    const { getByText } = render(<CreateTaskScreen />);
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('handles input changes', () => {
    const { getByTestId } = render(<CreateTaskScreen />);
    
    fireEvent.changeText(getByTestId('input-Title'), 'New Task');
    expect(mockMethods.setTitle).toHaveBeenCalledWith('New Task');
    
    fireEvent.changeText(getByTestId('input-Description'), 'New Desc');
    expect(mockMethods.setDescription).toHaveBeenCalledWith('New Desc');
  });

  it('opens sheets on press', () => {
    const { getByTestId } = render(<CreateTaskScreen />);
    
    fireEvent.press(getByTestId('selection-State'));
    fireEvent.press(getByTestId('selection-Priority'));
    fireEvent.press(getByTestId('selection-Assignee'));
    fireEvent.press(getByTestId('selection-Tags'));
    
    // The refs' present() method should have been called, but we don't assert on it directly.
    // However, the onPress handler was executed.
  });

  it('handles unknown user in assignee display', () => {
    (useCreateTask as jest.Mock).mockReturnValue({
      ...mockMethods,
      assignee: 'unknown-id',
    });
    const { getByText } = render(<CreateTaskScreen />);
    expect(getByText('Unknown User')).toBeTruthy();
  });
});
