import React from 'react';
import { View, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import FormSelection from '../FormSelection';

// Mock FormField to avoid issues with its internal logic
jest.mock('../FormField', () => {
  return ({ children, label }: { children: React.ReactNode; label: string }) => {
    const { View, Text } = require('react-native');
    return (
      <View data-testid="form-field">
        <Text data-testid="form-field-label">{label}</Text>
        {children}
      </View>
    );
  };
});

describe('FormSelection', () => {
  const defaultProps = {
    label: 'Select Project',
    value: null,
    onPress: jest.fn(),
  };

  it('renders correctly with placeholder when value is null', () => {
    const { getByText } = render(<FormSelection {...defaultProps} />);
    
    expect(getByText('Select Project')).toBeTruthy();
    expect(getByText('Select')).toBeTruthy();
  });

  it('renders correctly when value is provided', () => {
    const { getByText } = render(
      <FormSelection {...defaultProps} value="Project Alpha" />
    );
    
    expect(getByText('Project Alpha')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(<FormSelection {...defaultProps} />);
    
    fireEvent.press(getByTestId('form-selection-pressable'));
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByTestId } = render(
      <FormSelection {...defaultProps} disabled={true} />
    );
    
    const pressable = getByTestId('form-selection-pressable');
    // Check various ways the disabled prop might be stored/mocked
    const isDisabled = pressable.props.disabled || 
                       pressable.props.accessibilityState?.disabled ||
                       pressable.props.accessibilityStates?.includes('disabled');
    
    expect(isDisabled).toBeTruthy();
    
    expect(isDisabled).toBeTruthy();
  });
});
