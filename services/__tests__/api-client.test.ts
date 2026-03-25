import { apiClient } from '../api-client';
import { getToken, deleteToken } from '../auth-storage';
import { router } from 'expo-router';

jest.mock('../auth-storage', () => ({
  getToken: jest.fn(),
  deleteToken: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock global fetch
global.fetch = jest.fn();

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
  });

  it('performs a GET request successfully', async () => {
    (getToken as jest.Mock).mockResolvedValue('test-token');
    
    const response = await apiClient.get('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token',
        }),
      })
    );
    expect(response).toEqual({ ok: true, status: 200, data: { success: true } });
  });

  it('handles 401 Unauthorized by clearing token and redirecting', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    });

    const response = await apiClient.get('/unauthorized');

    expect(deleteToken).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/auth/login');
    expect(response).toEqual({ ok: false, status: 401, data: null });
  });

  it('handles network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network failure'));
    
    // Silence console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const response = await apiClient.get('/error');

    expect(response).toEqual({ ok: false, status: 500, data: null });
    consoleSpy.mockRestore();
  });

  it('builds URL with various parameter types', () => {
    const url = apiClient.buildUrl('/test', {
      q: 'search',
      tags: ['a', 'b'],
      empty: [],
      undef: undefined,
    });

    expect(url).toContain('q=search');
    expect(url).toContain('tags=a%2Cb'); // join(',')
    expect(url).not.toContain('empty');
    expect(url).not.toContain('undef');
  });

  it('performs POST, PUT, DELETE requests', async () => {
    await apiClient.post('/post', { foo: 'bar' });
    expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'POST', body: JSON.stringify({ foo: 'bar' }) }));

    await apiClient.put('/put', { foo: 'baz' });
    expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'PUT', body: JSON.stringify({ foo: 'baz' }) }));

    await apiClient.delete('/delete');
    expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'DELETE' }));
  });
});
