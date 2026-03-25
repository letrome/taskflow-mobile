import React from 'react';
jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");
import { render, fireEvent } from '@testing-library/react-native';
import ProjectCard from '@/components/ProjectCard';

describe('ProjectCard', () => {
  const mockProject: any = {
    id: '1',
    title: 'Test Project',
    status: 'active',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    members: [{ id: 'u1' }, { id: 'u2' }],
  };

  const mockOnPress = jest.fn();

  it('renders correctly for active project', () => {
    const { getByText } = render(<ProjectCard item={mockProject} onPress={mockOnPress} />);
    
    expect(getByText('Test Project')).toBeTruthy();
    expect(getByText('Active')).toBeTruthy();
    expect(getByText('1 janv. 2023 → 31 déc. 2023')).toBeTruthy();
    expect(getByText('2 membre(s)')).toBeTruthy();
  });

  it('renders correctly for archived project', () => {
    const archivedProject = { ...mockProject, status: 'archived' };
    const { getByText } = render(<ProjectCard item={archivedProject} onPress={mockOnPress} />);
    
    expect(getByText('Archived')).toBeTruthy();
  });

  it('handles press', () => {
    const { getByRole } = render(<ProjectCard item={mockProject} onPress={mockOnPress} />);
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).toHaveBeenCalledWith('1');
  });

  it('handles missing dates', () => {
    const projectNoDates = { ...mockProject, start_date: null, end_date: null };
    const { getByText } = render(<ProjectCard item={projectNoDates} onPress={mockOnPress} />);
    expect(getByText('--- → ---')).toBeTruthy();
  });
});
