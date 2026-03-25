import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProjectDates from '../ProjectDates';

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return (props: any) => (
    <TouchableOpacity 
      testID="dateTimePicker" 
      onPress={() => props.onChange({}, new Date('2023-01-02T00:00:00Z'))}
    >
      <Text>DateTimePicker Mock</Text>
    </TouchableOpacity>
  );
});

describe('ProjectDates', () => {
  const mockProject: any = {
    id: '1',
    start_date: '2023-01-01T00:00:00Z',
    end_date: '2023-12-31T00:00:00Z',
  };

  const mockSetProject = jest.fn();
  const mockUpdateProject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders labels and dates correctly', () => {
    const { getByText } = render(
      <ProjectDates 
        project={mockProject} 
        setProject={mockSetProject}
        updateProject={mockUpdateProject}
      />
    );
    
    expect(getByText('Start Date')).toBeTruthy();
    expect(getByText('End Date')).toBeTruthy();
  });

  it('handles start date change', () => {
    const { getByText, getByTestId } = render(
      <ProjectDates 
        project={mockProject} 
        setProject={mockSetProject}
        updateProject={mockUpdateProject}
      />
    );
    
    // Open picker for start date
    fireEvent.press(getByText('Start Date'));
    
    const picker = getByTestId('dateTimePicker');
    fireEvent.press(picker);
    
    expect(mockSetProject).toHaveBeenCalledWith(expect.objectContaining({ start_date: expect.any(String) }));
    expect(mockUpdateProject).toHaveBeenCalledWith(expect.objectContaining({ start_date: expect.any(String) }));
  });

  it('handles end date change', () => {
    const { getByText, getByTestId } = render(
      <ProjectDates 
        project={mockProject} 
        setProject={mockSetProject}
        updateProject={mockUpdateProject}
      />
    );
    
    // Open picker for end date
    fireEvent.press(getByText('End Date'));
    
    const picker = getByTestId('dateTimePicker');
    fireEvent.press(picker);
    
    expect(mockSetProject).toHaveBeenCalledWith(expect.objectContaining({ end_date: expect.any(String) }));
    expect(mockUpdateProject).toHaveBeenCalledWith(expect.objectContaining({ end_date: expect.any(String) }));
  });
});
