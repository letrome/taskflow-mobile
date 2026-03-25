import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../register';
import { authApi } from '@/services/auth-api';
import { router } from 'expo-router';

// Mock services
jest.mock('@/services/auth-api', () => ({
  authApi: {
    register: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    
    expect(getByPlaceholderText('First Name')).toBeTruthy();
    expect(getByPlaceholderText('Last Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('performs successful registration', async () => {
    (authApi.register as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      data: { message: 'User created' },
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    
    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(getByText('Account created successfully!')).toBeTruthy();
    });
  });

  it('shows error on registration failure', async () => {
    (authApi.register as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      data: { message: 'Email already exists.' },
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    
    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'existing@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Email already exists.')).toBeTruthy();
    });
  });

  it('navigates back to login screen', () => {
    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText('Login'));
    expect(router.replace).toHaveBeenCalledWith('/auth/login');
  });
});
