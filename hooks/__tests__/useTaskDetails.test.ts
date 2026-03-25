import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTaskDetails } from '../useTaskDetails';
import { taskApi } from '@/services/task-api';
import { projectApi } from '@/services/project-api';
import { userApi } from '@/services/user-api';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb: any) => require('react').useEffect(cb, []),
}));

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock('@/services/task-api', () => ({
  taskApi: {
    fetchTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    addTaskTag: jest.fn(),
    removeTaskTag: jest.fn(),
  },
}));

jest.mock('@/services/project-api', () => ({
  projectApi: {
    getProject: jest.fn(),
    getProjectTags: jest.fn(),
    addProjectTag: jest.fn(),
  },
}));

jest.mock('@/services/user-api', () => ({
  userApi: {
    getUser: jest.fn(),
  },
}));

describe('useTaskDetails', () => {
  const taskId = 'task-123';
  const mockTask = {
    id: taskId,
    title: 'Test Task',
    project: 'proj-123',
    assignee: 'user-123',
    tags: ['tag-1'],
    state: 'todo',
    priority: 'high',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (taskApi.fetchTask as jest.Mock).mockResolvedValue({ ok: true, status: 200, data: mockTask });
    (projectApi.getProjectTags as jest.Mock).mockResolvedValue({ ok: true, status: 200, data: [{ id: 'tag-1', name: 'Tag 1' }] });
    (projectApi.getProject as jest.Mock).mockResolvedValue({ ok: true, status: 200, data: { members: ['user-123'] } });
    (userApi.getUser as jest.Mock).mockResolvedValue({ ok: true, status: 200, data: { id: 'user-123', name: 'John Doe' } });
  });

  it('fetches task and related data on mount', async () => {
    const { result } = renderHook(() => useTaskDetails(taskId));

    await waitFor(() => {
      expect(result.current.task).not.toBeNull();
    });

    expect(taskApi.fetchTask).toHaveBeenCalledWith(taskId);
    expect(result.current.task).toEqual(mockTask);
    expect(result.current.assigneeUser).toEqual({ id: 'user-123', name: 'John Doe' });
  });

  it('handles fetch task failure', async () => {
    (taskApi.fetchTask as jest.Mock).mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useTaskDetails(taskId));
    
    // It should stay null or handle it silently (based on hook logic)
    await new Promise(r => setTimeout(r, 50));
    expect(result.current.task).toBeNull();
  });

  it('updates task correctly', async () => {
    const { result } = renderHook(() => useTaskDetails(taskId));
    await waitFor(() => expect(result.current.task).not.toBeNull());

    const updates = { title: 'Updated Title' };
    (taskApi.updateTask as jest.Mock).mockResolvedValue({ ok: true, status: 200, data: { ...mockTask, ...updates } });

    await act(async () => {
      await result.current.updateTask(updates);
    });

    expect(taskApi.updateTask).toHaveBeenCalledWith(taskId, expect.objectContaining(updates));
    expect(result.current.task?.title).toBe('Updated Title');
  });

  it('loads new assignee when task updated with different assignee', async () => {
    const { result } = renderHook(() => useTaskDetails(taskId));
    await waitFor(() => expect(result.current.task).not.toBeNull());

    const newAssigneeId = 'user-456';
    const newMockUser = { id: newAssigneeId, name: 'Jane Doe' };
    (userApi.getUser as jest.Mock).mockResolvedValue({ ok: true, data: newMockUser });
    (taskApi.updateTask as jest.Mock).mockResolvedValue({ ok: true, data: { ...mockTask, assignee: newAssigneeId } });

    await act(async () => {
      await result.current.updateTask({ assignee: newAssigneeId });
    });

    await waitFor(() => {
      expect(result.current.assigneeUser).toEqual(newMockUser);
    });
  });

  it('deletes task and navigates back', async () => {
    const { result } = renderHook(() => useTaskDetails(taskId));
    await waitFor(() => expect(result.current.task).not.toBeNull());

    (taskApi.deleteTask as jest.Mock).mockResolvedValue({ ok: true });
    const { router } = require('expo-router');

    await act(async () => {
      await result.current.deleteCurrentTask();
    });

    expect(taskApi.deleteTask).toHaveBeenCalledWith(taskId);
    expect(router.back).toHaveBeenCalled();
  });

  it('adds a tag by name (existing in project)', async () => {
    const { result } = renderHook(() => useTaskDetails(taskId));
    await waitFor(() => expect(result.current.task).not.toBeNull());

    (taskApi.addTaskTag as jest.Mock).mockResolvedValue({ ok: true });

    await act(async () => {
      await result.current.addTag('Tag 1');
    });

    expect(taskApi.addTaskTag).toHaveBeenCalledWith(taskId, 'tag-1');
    expect(result.current.tags).toContainEqual({ id: 'tag-1', name: 'Tag 1' });
  });

  it('adds a tag by name (new to project)', async () => {
    const { result } = renderHook(() => useTaskDetails(taskId));
    await waitFor(() => expect(result.current.task).not.toBeNull());

    (projectApi.addProjectTag as jest.Mock).mockResolvedValue({ 
      ok: true, 
      data: { id: 'new-tag-id', name: 'New Tag' } 
    });
    (taskApi.addTaskTag as jest.Mock).mockResolvedValue({ ok: true });

    await act(async () => {
      await result.current.addTag('New Tag');
    });

    expect(projectApi.addProjectTag).toHaveBeenCalledWith('proj-123', 'New Tag');
    expect(taskApi.addTaskTag).toHaveBeenCalledWith(taskId, 'new-tag-id');
  });

  it('removes a tag', async () => {
    const { result } = renderHook(() => useTaskDetails(taskId));
    await waitFor(() => expect(result.current.task).not.toBeNull());

    (taskApi.removeTaskTag as jest.Mock).mockResolvedValue({ ok: true, status: 204 });

    await act(async () => {
      await result.current.removeTag('tag-1');
    });

    expect(taskApi.removeTaskTag).toHaveBeenCalledWith(taskId, 'tag-1');
    expect(result.current.tags).toEqual([]);
  });

  it('handles tag removal failure by reverting state', async () => {
    const { result } = renderHook(() => useTaskDetails(taskId));
    await waitFor(() => expect(result.current.task).not.toBeNull());

    (taskApi.removeTaskTag as jest.Mock).mockResolvedValue({ ok: false });

    await act(async () => {
      await result.current.removeTag('tag-1');
    });

    expect(result.current.tags).toEqual([{ id: 'tag-1', name: 'Tag 1' }]);
  });
});
