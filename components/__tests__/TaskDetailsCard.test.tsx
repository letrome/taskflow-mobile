import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TaskDetailsCard from '../TaskDetailsCard';

// Dummy component to test sheet opening
const MockSheet = React.forwardRef((props: any, ref: any) => {
  const { View, TouchableOpacity, Text } = require('react-native');
  React.useImperativeHandle(ref, () => ({
    present: () => props.onPresent?.(),
    dismiss: jest.fn(),
  }));
  return (
    <View testID={props.testID}>
      {props.options?.map((opt: any) => (
        <TouchableOpacity key={opt.value} onPress={() => props.onSelect(opt.value)} testID={`option-${opt.value}`}>
          <Text>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

// Mock SearchableSelectionSheet and SelectionSheet
jest.mock('../SearchableSelectionSheet', () => {
  return (props: any) => <MockSheet {...props} testID="searchable-selection-sheet" />;
});

jest.mock('../SelectionSheet', () => {
  return (props: any) => <MockSheet {...props} testID="selection-sheet" />;
});

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return (props: any) => (
    <TouchableOpacity 
      testID="dateTimePicker" 
      onPress={() => props.onChange({}, new Date('2023-01-02T00:00:00Z'))}
    >
      <Text>DateTimePicker Mock</Text>
    </TouchableOpacity>
  );
});

describe('TaskDetailsCard', () => {
  const mockTask: any = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    due_date: '2023-01-01T00:00:00Z',
    priority: 'HIGH',
    assignee: 'user-1',
  };

  const mockUpdateTask = jest.fn();
  const mockSetTask = jest.fn();
  const mockAssignee: any = { id: 'user-1', first_name: 'John', last_name: 'Doe' };
  const mockMembers: any[] = [mockAssignee];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByDisplayValue, getByText, getAllByText } = render(
      <TaskDetailsCard 
        task={mockTask}
        updateTask={mockUpdateTask}
        setTask={mockSetTask}
        assignee={mockAssignee}
        projectMembers={mockMembers}
      />
    );
    
    expect(getByDisplayValue('Test Description')).toBeTruthy();
    expect(getByText('Due Date')).toBeTruthy();
    expect(getByText('Assignee')).toBeTruthy();
    expect(getByText('Priority')).toBeTruthy();
    expect(getAllByText('John Doe').length).toBeGreaterThan(0);
  });

  it('handles description change', () => {
    const { getByDisplayValue } = render(
      <TaskDetailsCard 
        task={mockTask}
        updateTask={mockUpdateTask}
        setTask={mockSetTask}
        assignee={mockAssignee}
        projectMembers={mockMembers}
      />
    );
    
    const input = getByDisplayValue('Test Description');
    fireEvent.changeText(input, 'New Description');
    expect(mockSetTask).toHaveBeenCalled();
    
    fireEvent(input, 'blur');
    expect(mockUpdateTask).toHaveBeenCalled();
  });

  it('handles date change', async () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <TaskDetailsCard 
        task={mockTask}
        updateTask={mockUpdateTask}
        setTask={mockSetTask}
        assignee={mockAssignee}
        projectMembers={mockMembers}
      />
    );
    
    // Open picker
    fireEvent.press(getByText('Due Date'));
    
    const picker = getByTestId('dateTimePicker');
    expect(picker).toBeTruthy();
    
    // Trigger change
    fireEvent.press(picker);
    
    expect(mockSetTask).toHaveBeenCalledWith(expect.objectContaining({ due_date: expect.any(String) }));
    expect(mockUpdateTask).toHaveBeenCalledWith(expect.objectContaining({ due_date: expect.any(String) }));
  });

  it('handles priority change', () => {
    const { getByText, getByTestId } = render(
      <TaskDetailsCard 
        task={mockTask}
        updateTask={mockUpdateTask}
        setTask={mockSetTask}
        assignee={mockAssignee}
        projectMembers={mockMembers}
      />
    );
    
    // SelectionSheet is mocked to render options immediately for testing
    const lowOption = getByTestId('option-LOW');
    fireEvent.press(lowOption);
    
    expect(mockSetTask).toHaveBeenCalledWith(expect.objectContaining({ priority: 'LOW' }));
    expect(mockUpdateTask).toHaveBeenCalledWith({ priority: 'LOW' });
  });

  it('handles assignee change', () => {
    const { getByTestId } = render(
      <TaskDetailsCard 
        task={mockTask}
        updateTask={mockUpdateTask}
        setTask={mockSetTask}
        assignee={mockAssignee}
        projectMembers={mockMembers}
      />
    );
    
    const unassignedOption = getByTestId('option-unassigned');
    fireEvent.press(unassignedOption);
    
    expect(mockSetTask).toHaveBeenCalledWith(expect.objectContaining({ assignee: null }));
    expect(mockUpdateTask).toHaveBeenCalledWith({ assignee: null });
  });
});
