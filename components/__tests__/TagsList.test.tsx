import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TagsList from '../TagsList';

describe('TagsList', () => {
  const mockTags = [
    { id: '1', name: 'Frontend' },
    { id: '2', name: 'UI/UX' },
  ];

  const mockOnAdd = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in view mode', () => {
    const { getByText, queryByText } = render(
      <TagsList tags={mockTags} editable={false} />
    );
    
    expect(getByText('Tags')).toBeTruthy();
    expect(getByText('Frontend')).toBeTruthy();
    expect(getByText('UI/UX')).toBeTruthy();
    expect(queryByText('Add')).toBeNull();
  });

  it('renders correctly in editable mode', () => {
    const { getByText } = render(
      <TagsList tags={mockTags} editable={true} />
    );
    
    expect(getByText('Add')).toBeTruthy();
  });

  it('handles add tag', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <TagsList tags={mockTags} editable={true} onAddTag={mockOnAdd} />
    );
    
    fireEvent.press(getByTestId('add-tag-button'));
    const input = getByPlaceholderText('New tag...');
    
    fireEvent.changeText(input, 'Backend');
    fireEvent(input, 'submitEditing');
    
    expect(mockOnAdd).toHaveBeenCalledWith('Backend');
  });

  it('handles delete tag', () => {
    const { getByTestId } = render(
      <TagsList tags={mockTags} editable={true} onDeleteTag={mockOnDelete} />
    );
    
    fireEvent.press(getByTestId('delete-tag-1'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});
