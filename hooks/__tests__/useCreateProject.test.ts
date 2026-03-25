import { renderHook, act } from '@testing-library/react-native';
import { useCreateProject } from '../useCreateProject';

jest.mock('../../services/project-api', () => ({
  projectApi: {
    createProject: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

const { projectApi } = require('../../services/project-api');
const { router } = require('expo-router');

describe('useCreateProject', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates project successfully and redirects', async () => {
    (projectApi.createProject as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      data: { id: 'new-proj-123' },
    });

    const { result } = renderHook(() => useCreateProject());

    await act(async () => {
      result.current.setTitle('New Project');
      result.current.setDescription('Description');
      result.current.setStartDate('2023-01-01');
      result.current.setEndDate('2023-12-31');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(projectApi.createProject).toHaveBeenCalled();
    expect(router.back).toHaveBeenCalled();
  });

  it('handles creation error', async () => {
    (projectApi.createProject as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      data: { message: 'Invalid data' },
    });

    const { result } = renderHook(() => useCreateProject());

    await act(async () => {
      result.current.setTitle('New Project');
      result.current.setDescription('Description');
      result.current.setStartDate('2023-01-01');
      result.current.setEndDate('2023-12-31');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.error).toBe('Invalid data');
  });
});
