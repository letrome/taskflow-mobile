import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskItem from '../TaskItem';

describe('TaskItem', () => {
  const mockTask: any = {
    id: 't1',
    title: 'Test Task',
    state: 'OPEN',
  };

  const mockOnViewTask = jest.fn();

  it('renders correctly for OPEN state', () => {
    const { getByText } = render(<TaskItem item={mockTask} onViewTask={mockOnViewTask} />);
    expect(getByText('Test Task')).toBeTruthy();
  });

  it('renders correctly for IN_PROGRESS state', () => {
    const inProgressTask = { ...mockTask, state: 'IN_PROGRESS' };
    const { getByText } = render(<TaskItem item={inProgressTask} onViewTask={mockOnViewTask} />);
    expect(getByText('Test Task')).toBeTruthy();
  });

  it('renders correctly for DONE state', () => {
    const doneTask = { ...mockTask, state: 'DONE' };
    const { getByText } = render(<TaskItem item={doneTask} onViewTask={mockOnViewTask} />);
    expect(getByText('Test Task')).toBeTruthy();
  });

  it('handles press', () => {
    const { getByRole } = render(<TaskItem item={mockTask} onViewTask={mockOnViewTask} />);
    fireEvent.press(getByRole('button'));
    expect(mockOnViewTask).toHaveBeenCalledWith('t1');
  });
});
