import { authApi } from '../auth-api';
import { apiClient } from '../api-client';

jest.mock('../api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login calls apiClient.post', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };
    await authApi.login(credentials);
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
  });

  it('register calls apiClient.post', async () => {
    const userData = { email: 'test@example.com', password: 'password', name: 'Test' };
    await authApi.register(userData);
    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
  });
});
