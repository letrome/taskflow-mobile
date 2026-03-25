import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskDetailsScreen from '../[id]';
import { useTaskDetails } from '@/hooks/useTaskDetails';
import { useLocalSearchParams } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock useTaskDetails hook
jest.mock('@/hooks/useTaskDetails');

// Mock components
jest.mock('@/components/TaskHeader', () => {
  const { View, Text } = require('react-native');
  return ({ task }: any) => (
    <View testID="task-header">
      <Text>{task.title}</Text>
    </View>
  );
});

jest.mock('@/components/TaskDetailsCard', () => {
  const { View, Text } = require('react-native');
  return ({ task }: any) => (
    <View testID="task-details-card">
      <Text>{task.description}</Text>
    </View>
  );
});

jest.mock('@/components/TagsList', () => {
  const { View } = require('react-native');
  return () => <View testID="tags-list" />;
});

jest.mock('@/components/TaskDelete', () => {
  const { View, Button } = require('react-native');
  return ({ onDelete }: any) => (
    <View testID="task-delete">
      <Button title="Delete" onPress={onDelete} testID="delete-button" />
    </View>
  );
});

describe('TaskDetailsScreen', () => {
  const mockId = 'task-123';
  const mockTask = {
    id: mockId,
    title: 'Test Task',
    description: 'Task Description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: mockId });
    (useTaskDetails as jest.Mock).mockReturnValue({
      task: mockTask,
      setTask: jest.fn(),
      tags: [],
      projectMembers: [],
      assigneeUser: null,
      updateTask: jest.fn(),
      deleteCurrentTask: jest.fn(),
      addTag: jest.fn(),
      removeTag: jest.fn(),
    });
  });

  it('renders loading state when task is null', () => {
    (useTaskDetails as jest.Mock).mockReturnValue({
      task: null,
    });

    const { toJSON } = render(<TaskDetailsScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders task details correctly', () => {
    const { getByText, getByTestId } = render(<TaskDetailsScreen />);
    
    expect(getByTestId('task-header')).toBeTruthy();
    expect(getByText('Test Task')).toBeTruthy();
    expect(getByTestId('task-details-card')).toBeTruthy();
    expect(getByText('Task Description')).toBeTruthy();
  });

  it('handles task deletion', () => {
    const deleteCurrentTask = jest.fn();
    (useTaskDetails as jest.Mock).mockReturnValue({
      task: mockTask,
      deleteCurrentTask,
    });

    const { getByTestId } = render(<TaskDetailsScreen />);
    fireEvent.press(getByTestId('delete-button'));
    expect(deleteCurrentTask).toHaveBeenCalled();
  });
});
