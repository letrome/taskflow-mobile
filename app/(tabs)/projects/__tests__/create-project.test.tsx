import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateProjectScreen from '../create-project';
import { useCreateProject } from '@/hooks/useCreateProject';

// Mock hook
jest.mock('@/hooks/useCreateProject');

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

jest.mock('@/components/CreateElementButton', () => {
  const { Button } = require('react-native');
  return ({ onPress, disabled, label }: any) => (
    <Button title={label} onPress={onPress} disabled={disabled} testID="submit-button" />
  );
});

describe('CreateProjectScreen', () => {
  const mockMethods = {
    title: '',
    setTitle: jest.fn(),
    description: '',
    setDescription: jest.fn(),
    startDate: new Date(),
    setStartDate: jest.fn(),
    endDate: new Date(),
    setEndDate: jest.fn(),
    isSubmitting: false,
    isFormValid: true,
    error: null,
    handleSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateProject as jest.Mock).mockReturnValue(mockMethods);
  });

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(<CreateProjectScreen />);
    
    expect(getByTestId('form-layout')).toBeTruthy();
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
    expect(getByTestId('submit-button')).toBeTruthy();
  });

  it('handles input changes', () => {
    const { getByTestId } = render(<CreateProjectScreen />);
    
    fireEvent.changeText(getByTestId('input-Title'), 'New Project');
    expect(mockMethods.setTitle).toHaveBeenCalledWith('New Project');
    
    fireEvent.changeText(getByTestId('input-Description'), 'New Desc');
    expect(mockMethods.setDescription).toHaveBeenCalledWith('New Desc');
  });

  it('handles date changes', () => {
    const { getByTestId } = render(<CreateProjectScreen />);
    
    fireEvent.press(getByTestId('picker-Start date *'));
    expect(mockMethods.setStartDate).toHaveBeenCalled();
    
    fireEvent.press(getByTestId('picker-End date *'));
    expect(mockMethods.setEndDate).toHaveBeenCalled();
  });

  it('handles submit', () => {
    const { getByTestId } = render(<CreateProjectScreen />);
    fireEvent.press(getByTestId('submit-button'));
    expect(mockMethods.handleSubmit).toHaveBeenCalled();
  });
});
