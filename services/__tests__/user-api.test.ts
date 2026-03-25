import { userApi } from '../user-api';
import { apiClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('userApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getUser calls apiClient.get', async () => {
    await userApi.getUser('user-123');
    expect(apiClient.get).toHaveBeenCalledWith('/users/user-123');
  });

  it('searchUsers calls apiClient.get', async () => {
    await userApi.searchUsers('test', '123');
    expect(apiClient.get).toHaveBeenCalledWith('/users/search', {
      params: { query: 'test', projectId: '123' },
    });
  });
});
