import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View, TouchableOpacity } from 'react-native';
import ProjectTasks from '../ProjectTasks';

// Simpler mock for ProjectTasks that doesn't use BottomSheetModalProvider
// We need to mock TaskFilterSheet to avoid its dependencies
jest.mock('../TaskFilterSheet', () => {
  const { View: RNView, Text: RNText } = require('react-native');
  return () => <RNView testID="task-filter-sheet"><RNText>Filter Sheet</RNText></RNView>;
});

// Mock TaskItem
jest.mock('../TaskItem', () => {
  const { Text: RNText, TouchableOpacity: RNTouchableOpacity } = require('react-native');
  return ({ item, onViewTask }: any) => (
    <RNTouchableOpacity onPress={() => onViewTask?.(item.id)}>
      <RNText>{item.title}</RNText>
    </RNTouchableOpacity>
  );
});

// Mock lucide-react-native
jest.mock('lucide-react-native', () => {
  const { View: RNView } = require('react-native');
  return {
    Filter: () => <RNView testID="filter-icon" />,
  };
});

// Mock BottomSheet components COMPLETELY to avoid safe area issues
jest.mock('@gorhom/bottom-sheet', () => {
  const ReactMock = require('react');
  const { View: RNView } = require('react-native');
  return {
    BottomSheetModal: ReactMock.forwardRef((props: any, ref: any) => {
      ReactMock.useImperativeHandle(ref, () => ({
        present: jest.fn(),
        dismiss: jest.fn(),
      }));
      return <RNView testID="bottom-sheet-modal" accessibilityLabel="bottom-sheet-modal">{props.children}</RNView>;
    }),
    BottomSheetView: RNView,
  };
});

// Mock Safe Area
jest.mock('react-native-safe-area-context', () => {
  const ReactMock = require('react');
  const { View: RNView } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: any) => <RNView>{children}</RNView>,
    SafeAreaView: ({ children }: any) => <RNView>{children}</RNView>,
    useSafeAreaInsets: () => ({ top: 0, left: 0, right: 0, bottom: 0 }),
  };
});

describe('ProjectTasks', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', state: 'TODO', priority: 'HIGH' },
    { id: '2', title: 'Task 2', state: 'DONE', priority: 'LOW' },
  ];
  const mockParams = {
    state: [],
    priority: [],
    tags: [],
    sort: [],
  };
  const setTaskParams = jest.fn();
  const onViewTask = jest.fn();

  it('renders tasks and header', () => {
    const { getByText } = render(
      <ProjectTasks
        tasks={mockTasks as any}
        taskParams={mockParams}
        setTaskParams={setTaskParams}
        projectTags={[]}
        onViewTask={onViewTask}
        header={<Text>Project Header</Text>}
      />
    );

    expect(getByText('Project Header')).toBeTruthy();
    expect(getByText('Tasks')).toBeTruthy();
    expect(getByText('Task 1')).toBeTruthy();
    expect(getByText('Task 2')).toBeTruthy();
  });

  it('handles task press', () => {
    const { getByText } = render(
      <ProjectTasks
        tasks={mockTasks as any}
        taskParams={mockParams}
        setTaskParams={setTaskParams}
        projectTags={[]}
        onViewTask={onViewTask}
      />
    );

    fireEvent.press(getByText('Task 1'));
    expect(onViewTask).toHaveBeenCalledWith('1');
  });

  it('shows empty state when no tasks', () => {
    const { getByText } = render(
      <ProjectTasks
        tasks={[]}
        taskParams={mockParams}
        setTaskParams={setTaskParams}
        projectTags={[]}
      />
    );

    expect(getByText('No tasks match the given criteria.')).toBeTruthy();
  });

  it('opens filter modal', () => {
    const { getByText } = render(
      <ProjectTasks
        tasks={mockTasks as any}
        taskParams={mockParams}
        setTaskParams={setTaskParams}
        projectTags={[]}
      />
    );

    fireEvent.press(getByText('Filters & Sort'));
  });

  it('indicates active filters', () => {
    const activeParams = { ...mockParams, state: ['TODO'] };
    const { getByText } = render(
      <ProjectTasks
        tasks={mockTasks as any}
        taskParams={activeParams}
        setTaskParams={setTaskParams}
        projectTags={[]}
      />
    );

    expect(getByText('Filters & Sort (Active)')).toBeTruthy();
  });
});
