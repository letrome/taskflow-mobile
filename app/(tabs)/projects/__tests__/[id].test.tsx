import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProjectDetailsScreen from '../[id]';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { useLocalSearchParams, router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    push: jest.fn(),
  },
}));

// Mock useProjectDetails hook
jest.mock('@/hooks/useProjectDetails');

// Mock components
jest.mock('@/components/ProjectTasks', () => {
  const { View, Text, Button } = require('react-native');
  return ({ tasks, onViewTask, header, onRefresh }: any) => (
    <View testID="project-tasks">
      {header}
      {tasks.map((t: any) => (
        <Button key={t.id} title={t.title} onPress={() => onViewTask(t.id)} testID={`task-${t.id}`} />
      ))}
      <Button title="Refresh" onPress={onRefresh} testID="refresh-button" />
    </View>
  );
});

jest.mock('@/components/ProjectHeader', () => {
  const { View, Text } = require('react-native');
  return ({ project }: any) => (
    <View testID="project-header">
      <Text>{project.name}</Text>
    </View>
  );
});

jest.mock('@/components/ProjectDetailsCard', () => {
  const { View, Text } = require('react-native');
  return ({ project }: any) => (
    <View testID="project-details-card">
      <Text>{project.description}</Text>
    </View>
  );
});

jest.mock('@/components/ProjectMembersList', () => {
  const { View } = require('react-native');
  return () => <View testID="project-members-list" />;
});

jest.mock('@/components/TagsList', () => {
  const { View } = require('react-native');
  return () => <View testID="tags-list" />;
});

jest.mock('@/components/CreateElement', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPress }: any) => (
    <TouchableOpacity onPress={onPress} testID="create-task-button">
      <Text>Create Task</Text>
    </TouchableOpacity>
  );
});

describe('ProjectDetailsScreen', () => {
  const mockId = 'proj-123';
  const mockProject = {
    id: mockId,
    name: 'Test Project',
    description: 'Project Description',
  };
  const mockTasks = [
    { id: 'task-1', title: 'Task 1' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: mockId });
    (useProjectDetails as jest.Mock).mockReturnValue({
      project: mockProject,
      projectOwner: { id: 'owner-1', first_name: 'John', last_name: 'Doe' },
      tasks: mockTasks,
      taskParams: {},
      setTaskParams: jest.fn(),
      tags: [],
      projectMembers: [],
      isOwner: true,
      setProject: jest.fn(),
      updateProject: jest.fn(),
      addTag: jest.fn(),
      deleteTag: jest.fn(),
      addProjectMember: jest.fn(),
      deleteProjectMember: jest.fn(),
      isRefreshing: false,
      refresh: jest.fn(),
    });
  });

  it('renders loading state when project is null', () => {
    (useProjectDetails as jest.Mock).mockReturnValue({
      project: null,
    });

    const { getByTestId } = render(<ProjectDetailsScreen />);
    // Check for ActivityIndicator (we can't easily get it by testID if it doesn't have one, but we check if project components are NOT there)
    expect(render(<ProjectDetailsScreen />).toJSON()).toMatchSnapshot();
  });

  it('renders project details correctly', () => {
    const { getByText, getByTestId } = render(<ProjectDetailsScreen />);
    
    expect(getByTestId('project-header')).toBeTruthy();
    expect(getByText('Test Project')).toBeTruthy();
    expect(getByTestId('project-details-card')).toBeTruthy();
    expect(getByText('Project Description')).toBeTruthy();
    expect(getByTestId('project-tasks')).toBeTruthy();
    expect(getByText('Task 1')).toBeTruthy();
  });

  it('navigates to create task', () => {
    const { getByTestId } = render(<ProjectDetailsScreen />);
    fireEvent.press(getByTestId('create-task-button'));
    expect(router.push).toHaveBeenCalledWith(`/projects/tasks/create-task?projectId=${mockId}`);
  });

  it('navigates to task details', () => {
    const { getByTestId } = render(<ProjectDetailsScreen />);
    fireEvent.press(getByTestId('task-task-1'));
    expect(router.push).toHaveBeenCalledWith('/projects/tasks/task-1');
  });

  it('handles refresh', () => {
    const refresh = jest.fn();
    (useProjectDetails as jest.Mock).mockReturnValue({
      project: mockProject,
      tasks: mockTasks,
      refresh,
    });

    const { getByTestId } = render(<ProjectDetailsScreen />);
    fireEvent.press(getByTestId('refresh-button'));
    expect(refresh).toHaveBeenCalled();
  });
});
