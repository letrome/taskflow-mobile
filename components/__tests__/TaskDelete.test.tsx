import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskDelete from '../TaskDelete';

describe('TaskDelete', () => {
  const mockOnDelete = jest.fn();

  it('renders delete button', () => {
    const { getByText } = render(<TaskDelete onDelete={mockOnDelete} isDeleting={false} />);
    
    expect(getByText('Delete Task')).toBeTruthy();
  });

  it('handles delete press', () => {
    const { getByText } = render(<TaskDelete onDelete={mockOnDelete} isDeleting={false} />);
    
    fireEvent.press(getByText('Delete Task'));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('shows deleting state', () => {
    const { getByText } = render(<TaskDelete onDelete={mockOnDelete} isDeleting={true} />);
    
    expect(getByText('Deleting...')).toBeTruthy();
  });
});
