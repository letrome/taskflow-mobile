import { projectApi } from '../project-api';
import { apiClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('projectApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProjects calls apiClient.get', async () => {
    await projectApi.getProjects();
    expect(apiClient.get).toHaveBeenCalledWith('/projects');
  });

  it('getProject calls apiClient.get with id', async () => {
    await projectApi.getProject('123');
    expect(apiClient.get).toHaveBeenCalledWith('/projects/123');
  });

  it('createProject calls apiClient.post', async () => {
    const data = {
      title: 'New Project',
      description: 'Desc',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      status: 'active',
      members: [],
    };
    await projectApi.createProject(data);
    expect(apiClient.post).toHaveBeenCalledWith('/projects', data);
  });

  it('updateProject calls apiClient.put', async () => {
    const data = { title: 'Updated' };
    await projectApi.updateProject('123', data);
    expect(apiClient.put).toHaveBeenCalledWith('/projects/123', data);
  });

  it('getProjectTags calls apiClient.get', async () => {
    await projectApi.getProjectTags('123');
    expect(apiClient.get).toHaveBeenCalledWith('/projects/123/tags');
  });

  it('addProjectTag calls apiClient.post', async () => {
    await projectApi.addProjectTag('123', 'New Tag');
    expect(apiClient.post).toHaveBeenCalledWith('/projects/123/tags', { name: 'New Tag' });
  });

  it('deleteTag calls apiClient.delete', async () => {
    await projectApi.deleteTag('tag-1');
    expect(apiClient.delete).toHaveBeenCalledWith('/tags/tag-1');
  });

  it('addProjectMember calls apiClient.post', async () => {
    await projectApi.addProjectMember('123', 'user-1');
    expect(apiClient.post).toHaveBeenCalledWith('/projects/123/members', { members: ['user-1'] });
  });

  it('deleteProjectMember calls apiClient.delete', async () => {
    await projectApi.deleteProjectMember('123', 'user-1');
    expect(apiClient.delete).toHaveBeenCalledWith('/projects/123/members/user-1');
  });

  it('getTasks calls apiClient.get', async () => {
    await projectApi.getTasks('123');
    expect(apiClient.get).toHaveBeenCalledWith('/projects/123/tasks', { params: undefined });
  });

  it('getTasks with params calls apiClient.get', async () => {
    const params = { state: ['OPEN'] };
    await projectApi.getTasks('123', params);
    expect(apiClient.get).toHaveBeenCalledWith('/projects/123/tasks', { params });
  });

  it('createProjectTask handles assignee null correctly', async () => {
    const data = {
      title: 'Task',
      description: 'Desc',
      due_date: '2025-01-01',
      priority: 'MEDIUM',
      state: 'OPEN',
      assignee: null,
      tags: [],
    };
    await projectApi.createProjectTask('123', data);
    const { assignee, ...restData } = data;
    expect(apiClient.post).toHaveBeenCalledWith('/projects/123/tasks', restData);
  });

  it('createProjectTask handles assignee string correctly', async () => {
    const data = {
      title: 'Task',
      description: 'Desc',
      due_date: '2025-01-01',
      priority: 'MEDIUM',
      state: 'OPEN',
      assignee: 'user-1',
      tags: [],
    };
    await projectApi.createProjectTask('123', data);
    expect(apiClient.post).toHaveBeenCalledWith('/projects/123/tasks', data);
  });
});
