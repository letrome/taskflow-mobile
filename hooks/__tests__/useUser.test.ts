import { renderHook, waitFor } from '@testing-library/react-native';
import { useUser } from '../useUser';
import { userApi } from '@/services/user-api';
import * as authStorage from '@/services/auth-storage';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb: any) => require('react').useEffect(cb, []),
}));

jest.mock('@/services/user-api', () => ({
  userApi: {
    getUser: jest.fn(),
  },
}));

jest.mock('@/services/auth-storage', () => ({
  getCurrentUserId: jest.fn(),
}));

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads current user successfully', async () => {
    const mockUser = { id: '1', name: 'Test User' };
    const idSpy = jest.spyOn(authStorage, 'getCurrentUserId').mockResolvedValue('1');
    const userSpy = jest.spyOn(userApi, 'getUser').mockResolvedValue({
      ok: true,
      data: mockUser as any,
      status: 200,
    });

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    idSpy.mockRestore();
    userSpy.mockRestore();
  });
});
