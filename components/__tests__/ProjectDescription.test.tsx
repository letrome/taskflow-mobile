import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProjectDescription from '../ProjectDescription';

describe('ProjectDescription', () => {
  const mockProject: any = {
    id: '1',
    description: 'Test Description',
  };

  const mockSetProject = jest.fn();
  const mockUpdateProject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByDisplayValue } = render(
      <ProjectDescription 
        project={mockProject} 
        setProject={mockSetProject}
        updateProject={mockUpdateProject}
      />
    );
    expect(getByDisplayValue('Test Description')).toBeTruthy();
  });

  it('handles description change and blur', () => {
    const { getByDisplayValue } = render(
      <ProjectDescription 
        project={mockProject} 
        setProject={mockSetProject}
        updateProject={mockUpdateProject}
      />
    );
    
    const input = getByDisplayValue('Test Description');
    fireEvent.changeText(input, 'New Description');
    expect(mockSetProject).toHaveBeenCalled();
    
    fireEvent(input, 'blur');
    expect(mockUpdateProject).toHaveBeenCalled();
  });
});
