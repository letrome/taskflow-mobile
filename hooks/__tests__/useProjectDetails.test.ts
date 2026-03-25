import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProjectDetails } from '../useProjectDetails';
import { projectApi } from '@/services/project-api';
import { userApi } from '@/services/user-api';
import { getCurrentUserId } from '@/services/auth-storage';

// Mock dependencies
jest.mock('@/services/project-api');
jest.mock('@/services/user-api');
jest.mock('@/services/auth-storage');

describe('useProjectDetails', () => {
  const mockProjectId = '1';
  const mockProject = {
    id: '1',
    title: 'Test Project',
    created_by: 'user-1',
    members: ['user-1', 'user-2'],
  };
  const mockTasks = [{ id: 't1', title: 'Task 1' }];
  const mockTags = [{ id: 'tag1', name: 'Tag 1' }];
  const mockUser = { id: 'user-1', first_name: 'John', last_name: 'Doe' };
  const mockUser2 = { id: 'user-2', first_name: 'Jane', last_name: 'Doe' };

  beforeEach(() => {
    jest.clearAllMocks();
    (projectApi.getProject as jest.Mock).mockResolvedValue({ ok: true, data: mockProject });
    (projectApi.getTasks as jest.Mock).mockResolvedValue({ ok: true, data: mockTasks });
    (projectApi.getProjectTags as jest.Mock).mockResolvedValue({ ok: true, data: mockTags });
    (userApi.getUser as jest.Mock)
      .mockResolvedValueOnce({ ok: true, data: mockUser }) // for creator
      .mockResolvedValueOnce({ ok: true, data: mockUser }) // for member 1
      .mockResolvedValueOnce({ ok: true, data: mockUser2 }); // for member 2
    (getCurrentUserId as jest.Mock).mockResolvedValue('user-1');
  });

  it('loads project details on init', async () => {
    const { result } = renderHook(() => useProjectDetails(mockProjectId));

    await waitFor(() => {
      expect(result.current.project).toEqual(mockProject);
    });

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.tags).toEqual(mockTags);
    expect(result.current.isOwner).toBe(true);
    await waitFor(() => expect(result.current.projectMembers).toHaveLength(2));
  });

  it('handles fetch project failure', async () => {
    (projectApi.getProject as jest.Mock).mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useProjectDetails(mockProjectId));
    
    await waitFor(() => {
      expect(result.current.project).toBeNull();
    });
  });

  it('updates project correctly', async () => {
    (projectApi.updateProject as jest.Mock).mockResolvedValue({ 
      ok: true, 
      data: { ...mockProject, title: 'Updated' } 
    });
    const { result } = renderHook(() => useProjectDetails(mockProjectId));

    await waitFor(() => expect(result.current.project).not.toBeNull());

    await act(async () => {
      await result.current.updateProject({ title: 'Updated' });
    });

    await waitFor(() => {
      expect(projectApi.updateProject).toHaveBeenCalledWith(mockProjectId, expect.objectContaining({
        title: 'Updated'
      }));
    });
  });

  it('handles refresh correctly', async () => {
    const { result } = renderHook(() => useProjectDetails(mockProjectId));
    await waitFor(() => expect(result.current.project).not.toBeNull());

    await act(async () => {
      await result.current.refresh();
    });

    expect(projectApi.getProject).toHaveBeenCalledTimes(2);
    expect(result.current.isRefreshing).toBe(false);
  });

  it('adds a tag correctly', async () => {
    const newTag = { id: 'tag2', name: 'New Tag' };
    (projectApi.addProjectTag as jest.Mock).mockResolvedValue({ ok: true, data: newTag });
    
    const { result } = renderHook(() => useProjectDetails(mockProjectId));

    await waitFor(() => expect(result.current.project).not.toBeNull());

    await act(async () => {
      await result.current.addTag('New Tag');
    });

    await waitFor(() => {
      expect(result.current.tags).toContainEqual(newTag);
    });
  });

  it('handles deleteTag with optimistic UI and revert on failure', async () => {
    (projectApi.deleteTag as jest.Mock).mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useProjectDetails(mockProjectId));
    
    await waitFor(() => expect(result.current.tags).toEqual(mockTags));

    await act(async () => {
      await result.current.deleteTag('tag1');
    });

    // Should revert back to mockTags because of failure
    expect(result.current.tags).toEqual(mockTags);
  });

  it('handles addProjectMember with optimistic UI and revert on failure', async () => {
    (projectApi.addProjectMember as jest.Mock).mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useProjectDetails(mockProjectId));
    
    await waitFor(() => {
      expect(result.current.projectMembers).toHaveLength(2);
    });

    await act(async () => {
      await result.current.addProjectMember({ id: 'new-user-id', first_name: 'New', last_name: 'User' } as any);
    });

    // Should revert back because of failure
    expect(result.current.projectMembers).toHaveLength(2);
  });

  it('deletes a project member correctly', async () => {
    (projectApi.deleteProjectMember as jest.Mock).mockResolvedValue({ ok: true });
    
    const { result } = renderHook(() => useProjectDetails(mockProjectId));

    await waitFor(() => expect(result.current.projectMembers).toHaveLength(2));

    await act(async () => {
      await result.current.deleteProjectMember('user-2');
    });

    expect(projectApi.deleteProjectMember).toHaveBeenCalledWith(mockProjectId, 'user-2');
  });
});
