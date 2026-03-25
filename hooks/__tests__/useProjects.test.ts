import { renderHook, waitFor } from '@testing-library/react-native';
import { useProjects } from '../useProjects';
import { projectApi } from '@/services/project-api';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb: any) => require('react').useEffect(cb, []),
}));

// Mock the base API client to prevent real network calls
jest.mock('@/services/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('useProjects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads projects successfully', async () => {
    const mockProjects = [{ id: '1', title: 'Project 1' }];
    const spy = jest.spyOn(projectApi, 'getProjects').mockResolvedValue({
      ok: true,
      status: 200,
      data: mockProjects as any,
    });

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.projects).toEqual(mockProjects);
    expect(result.current.error).toBeNull();
    spy.mockRestore();
  });

  it('handles error during fetch', async () => {
    const spy = jest.spyOn(projectApi, 'getProjects').mockResolvedValue({
      ok: false,
      status: 500,
      data: null,
    });

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.projects).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch projects');
    spy.mockRestore();
  });
});
