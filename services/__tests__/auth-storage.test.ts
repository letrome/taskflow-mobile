import * as SecureStore from 'expo-secure-store';
import { saveToken, getToken, deleteToken, decodeToken, getCurrentUserId } from '../auth-storage';
import { jwtDecode } from 'jwt-decode';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

describe('authStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveToken', () => {
    it('calls SecureStore.setItemAsync', async () => {
      await saveToken('test-token');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(expect.any(String), 'test-token');
    });

    it('handles error', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(new Error('Fail'));
      await saveToken('token');
      expect(spy).toHaveBeenCalledWith('Error saving token', expect.any(Error));
      spy.mockRestore();
    });
  });

  describe('getToken', () => {
    it('calls SecureStore.getItemAsync', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-token');
      const token = await getToken();
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(expect.any(String));
      expect(token).toBe('test-token');
    });

    it('handles error', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Fail'));
      const token = await getToken();
      expect(token).toBeNull();
      expect(spy).toHaveBeenCalledWith('Error getting token', expect.any(Error));
      spy.mockRestore();
    });
  });

  describe('deleteToken', () => {
    it('calls SecureStore.deleteItemAsync', async () => {
      await deleteToken();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(expect.any(String));
    });

    it('handles error', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(new Error('Fail'));
      await deleteToken();
      expect(spy).toHaveBeenCalledWith('Error deleting token', expect.any(Error));
      spy.mockRestore();
    });
  });

  describe('decodeToken', () => {
    it('returns decoded payload', () => {
      const payload = { id: '123' };
      (jwtDecode as jest.Mock).mockReturnValue(payload);
      expect(decodeToken('token')).toBe(payload);
    });

    it('handles error and returns null', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      (jwtDecode as jest.Mock).mockImplementation(() => { throw new Error('Invalid'); });
      expect(decodeToken('invalid')).toBeNull();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('getCurrentUserId', () => {
    it('returns id from token', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('token');
      (jwtDecode as jest.Mock).mockReturnValue({ id: 'user-123' });
      const id = await getCurrentUserId();
      expect(id).toBe('user-123');
    });

    it('returns sub if id is missing', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('token');
      (jwtDecode as jest.Mock).mockReturnValue({ sub: 'user-456' });
      const id = await getCurrentUserId();
      expect(id).toBe('user-456');
    });

    it('returns userId if id and sub are missing', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('token');
      (jwtDecode as jest.Mock).mockReturnValue({ userId: 'user-789' });
      const id = await getCurrentUserId();
      expect(id).toBe('user-789');
    });

    it('returns null if no token', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      const id = await getCurrentUserId();
      expect(id).toBeNull();
    });

    it('returns null if decoding fails', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('token');
      (jwtDecode as jest.Mock).mockReturnValue(null);
      const id = await getCurrentUserId();
      expect(id).toBeNull();
    });
  });
});
