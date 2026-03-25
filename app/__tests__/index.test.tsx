import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Index from '../index';
import { getToken } from '../../services/auth-storage';
import { Redirect } from 'expo-router';

// Mock auth-storage
jest.mock('../../services/auth-storage', () => ({
  getToken: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
}));

describe('Index (Root Redirect)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    (getToken as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves
    
    const { toJSON } = render(<Index />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('redirects to projects when token exists', async () => {
    (getToken as jest.Mock).mockResolvedValue('fake-token');
    
    render(<Index />);
    
    await waitFor(() => {
      expect(Redirect).toHaveBeenCalledWith(
        expect.objectContaining({ href: '/(tabs)/projects' }),
        undefined
      );
    });
  });

  it('redirects to login when no token exists', async () => {
    (getToken as jest.Mock).mockResolvedValue(null);
    
    render(<Index />);
    
    await waitFor(() => {
      expect(Redirect).toHaveBeenCalledWith(
        expect.objectContaining({ href: '/auth/login' }),
        undefined
      );
    });
  });

  it('handles error during auth check and redirects to login', async () => {
    (getToken as jest.Mock).mockRejectedValue(new Error('Auth failed'));
    
    render(<Index />);
    
    await waitFor(() => {
      expect(Redirect).toHaveBeenCalledWith(
        expect.objectContaining({ href: '/auth/login' }),
        undefined
      );
    });
  });
});
