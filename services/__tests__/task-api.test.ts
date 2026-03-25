import { taskApi } from '../task-api';
import { apiClient } from '../api-client';

// Mock apiClient
jest.mock('../api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('taskApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchTask calls apiClient.get', async () => {
    await taskApi.fetchTask('123');
    expect(apiClient.get).toHaveBeenCalledWith('/tasks/123');
  });

  it('addTaskTag calls apiClient.post', async () => {
    await taskApi.addTaskTag('task-1', 'tag-1');
    expect(apiClient.post).toHaveBeenCalledWith('/tasks/task-1/tags/tag-1');
  });

  it('removeTaskTag calls apiClient.delete', async () => {
    await taskApi.removeTaskTag('task-1', 'tag-1');
    expect(apiClient.delete).toHaveBeenCalledWith('/tasks/task-1/tags/tag-1');
  });

  it('updateTask calls apiClient.patch with data', async () => {
    const data = { title: 'New Title' };
    await taskApi.updateTask('123', data);
    expect(apiClient.patch).toHaveBeenCalledWith('/tasks/123', data);
  });

  it('deleteTask calls apiClient.delete', async () => {
    await taskApi.deleteTask('123');
    expect(apiClient.delete).toHaveBeenCalledWith('/tasks/123');
  });
});
