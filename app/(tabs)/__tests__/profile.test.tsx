import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../profile';
import { useUser } from '@/hooks/useUser';
import { useProjects } from '@/hooks/useProjects';
import { deleteToken } from '@/services/auth-storage';
import { router } from 'expo-router';

// Mock hooks
jest.mock('@/hooks/useUser');
jest.mock('@/hooks/useProjects');
// Mock auth-storage
jest.mock('@/services/auth-storage', () => ({
  deleteToken: jest.fn(),
}));
// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock components
jest.mock('@/components/UserProfile', () => {
  const { View, Text } = require('react-native');
  return ({ user, loading }: any) => (
    <View testID="user-profile">
      <Text>{loading ? 'Loading...' : user?.first_name}</Text>
    </View>
  );
});

describe('ProfileScreen', () => {
  const mockUser = { first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
  const mockProjects = [
    { id: '1', status: 'active' },
    { id: '2', status: 'archived' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
    (useProjects as jest.Mock).mockReturnValue({ projects: mockProjects });
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ProfileScreen />);
    
    expect(getByText('Profile')).toBeTruthy();
    expect(getByTestId('user-profile')).toBeTruthy();
    expect(getByText('John')).toBeTruthy();
    expect(getByText('Statistics')).toBeTruthy();
    expect(getByText('2')).toBeTruthy(); // Total projects
    expect(getByText('1')).toBeTruthy(); // Active projects
  });

  it('handles logout successfully', async () => {
    (deleteToken as jest.Mock).mockResolvedValue(undefined);
    const { getByText } = render(<ProfileScreen />);
    
    fireEvent.press(getByText('Logout'));
    
    await waitFor(() => {
      expect(deleteToken).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('handles logout error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (deleteToken as jest.Mock).mockRejectedValue(new Error('Logout failed'));
    
    const { getByText } = render(<ProfileScreen />);
    fireEvent.press(getByText('Logout'));
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Logout failed', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });
});
