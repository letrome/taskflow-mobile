import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskHeader from '../TaskHeader';

// Mock SelectionSheet
jest.mock('../SelectionSheet', () => {
  const ReactMock = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return ReactMock.forwardRef((props: any, ref: any) => {
    ReactMock.useImperativeHandle(ref, () => ({
      present: () => props.onPresent?.() || console.log('present called'),
      dismiss: jest.fn(),
    }));
    return (
      <View testID="selection-sheet">
        {props.options?.map((opt: any) => (
          <TouchableOpacity 
            key={opt.value} 
            onPress={() => props.onSelect(opt.value)} 
            testID={`option-${opt.value}`}
          >
            <Text>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  });
});

describe('TaskHeader', () => {
  const mockTask: any = {
    id: '1',
    title: 'Test Task',
    state: 'TODO',
  };

  const mockUpdateTask = jest.fn();
  const mockSetTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and state correctly', () => {
    const { getByDisplayValue, getByText } = render(
      <TaskHeader 
        task={mockTask} 
        updateTask={mockUpdateTask}
        setTask={mockSetTask}
      />
    );
    
    expect(getByDisplayValue('Test Task')).toBeTruthy();
    expect(getByText('TODO')).toBeTruthy();
  });

  it('handles title change', () => {
    const { getByDisplayValue } = render(
      <TaskHeader 
        task={mockTask} 
        updateTask={mockUpdateTask}
        setTask={mockSetTask}
      />
    );
    
    const input = getByDisplayValue('Test Task');
    fireEvent.changeText(input, 'Updated Task');
    expect(mockSetTask).toHaveBeenCalled();
    
    fireEvent(input, 'blur');
    expect(mockUpdateTask).toHaveBeenCalled();
  });

  it('handles state change', () => {
    const { getByTestId } = render(
      <TaskHeader 
        task={mockTask} 
        updateTask={mockUpdateTask}
        setTask={mockSetTask}
      />
    );
    
    // In our mock, SelectionSheet renders options immediately
    const inProgressOption = getByTestId('option-IN_PROGRESS');
    fireEvent.press(inProgressOption);
    
    expect(mockSetTask).toHaveBeenCalledWith(expect.objectContaining({ state: 'IN_PROGRESS' }));
    expect(mockUpdateTask).toHaveBeenCalledWith({ state: 'IN_PROGRESS' });
  });
});
