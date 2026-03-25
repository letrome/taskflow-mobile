import { renderHook, act } from '@testing-library/react-native';
import { useCreateTask } from '../useCreateTask';
import { projectApi } from '../../services/project-api';
import { userApi } from '../../services/user-api';
import { router } from 'expo-router';

jest.mock('../../services/project-api', () => ({
  projectApi: {
    createProjectTask: jest.fn(),
    getProjectTags: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    getProject: jest.fn().mockResolvedValue({ ok: true, data: { members: [] } }),
  },
}));

jest.mock('../../services/user-api', () => ({
  userApi: {
    getUser: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

describe('useCreateTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (projectApi.getProjectTags as jest.Mock).mockResolvedValue({ ok: true, data: [] });
    (projectApi.getProject as jest.Mock).mockResolvedValue({ ok: true, data: { members: [] } });
  });

  it('creates task successfully and redirects', async () => {
    (projectApi.createProjectTask as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      data: { id: 'new-task-123' },
    });

    const { result } = renderHook(() => useCreateTask('proj-1'));

    await act(async () => {
      // Fill required fields
      result.current.setTitle('New Task');
      result.current.setDescription('Description');
      result.current.setDueDate('2023-12-31');
      result.current.setPriority('MEDIUM');
      result.current.setState('OPEN');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(projectApi.createProjectTask).toHaveBeenCalled();
    expect(router.back).toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('handles creation error', async () => {
    (projectApi.createProjectTask as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      data: { message: 'Bad Request' },
    });

    const { result } = renderHook(() => useCreateTask('proj-1'));

    await act(async () => {
      result.current.setTitle('New Task');
      result.current.setDescription('Description');
      result.current.setDueDate('2023-12-31');
      result.current.setPriority('MEDIUM');
      result.current.setState('OPEN');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe('Bad Request');
    expect(router.back).not.toHaveBeenCalled();
  });

  it('loads project members and tags on init', async () => {
    const mockTags = [
      { id: 't1', name: 'Tag 1' },
      '  ', // Empty string to be filtered
      'Tag 2' // Raw string tag
    ];
    const mockProject = {
      members: ['user-1', 'user-2']
    };
    const mockUser1 = { id: 'user-1', first_name: 'John' };
    const mockUser2 = { id: 'user-2', first_name: 'Jane' };

    (projectApi.getProjectTags as jest.Mock).mockResolvedValue({ ok: true, data: mockTags });
    (projectApi.getProject as jest.Mock).mockResolvedValue({ ok: true, data: mockProject });
    
    (userApi.getUser as jest.Mock)
      .mockResolvedValueOnce({ ok: true, data: mockUser1 })
      .mockResolvedValueOnce({ ok: true, data: mockUser2 });

    const { result } = renderHook(() => useCreateTask('proj-1'));

    const { waitFor } = require('@testing-library/react-native');
    await waitFor(() => {
      expect(result.current.isLoadingProjectData).toBe(false);
    });

    expect(result.current.tagOptions).toContainEqual({ value: 't1', label: 'Tag 1' });
    expect(result.current.tagOptions).toContainEqual({ value: 'Tag 2', label: 'Tag 2' });
    expect(result.current.projectMembers).toHaveLength(2);
    expect(result.current.projectMembers[0].first_name).toBe('John');
  });

  it('handles tag toggling', () => {
    const { result } = renderHook(() => useCreateTask('proj-1'));
    
    act(() => {
      result.current.toggleTag('Tag 1');
    });
    expect(result.current.tags).toContain('Tag 1');
    
    act(() => {
      result.current.toggleTag('Tag 1');
    });
    expect(result.current.tags).not.toContain('Tag 1');
  });
});
