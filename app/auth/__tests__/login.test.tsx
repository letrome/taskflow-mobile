import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../login';
import { authApi } from '@/services/auth-api';
import { saveToken } from '@/services/auth-storage';
import { router } from 'expo-router';

// Mock services
jest.mock('@/services/auth-api', () => ({
  authApi: {
    login: jest.fn(),
  },
}));

jest.mock('@/services/auth-storage', () => ({
  saveToken: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('handles input changes', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    // We can't easily check state directly, but we can verify it on submit
  });

  it('performs successful login', async () => {
    const mockToken = 'test-token';
    (authApi.login as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      data: { token: mockToken },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(saveToken).toHaveBeenCalledWith(mockToken);
      expect(router.replace).toHaveBeenCalledWith('/(tabs)/projects');
    });
  });

  it('shows error on invalid credentials', async () => {
    (authApi.login as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      data: { message: 'Invalid credentials.' },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@email.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Invalid credentials.')).toBeTruthy();
    });
  });

  it('navigates to register screen', () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Register'));
    expect(router.push).toHaveBeenCalledWith('/auth/register');
  });
});
