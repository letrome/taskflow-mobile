import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProjectHeader from '../ProjectHeader';

// Mock SelectionSheet
jest.mock('../SelectionSheet', () => {
  const ReactMock = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return ReactMock.forwardRef((props: any, ref: any) => {
    ReactMock.useImperativeHandle(ref, () => ({
      present: jest.fn(),
      dismiss: jest.fn(),
    }));
    return (
      <View testID="selection-sheet">
        {props.options?.map((opt: any) => (
          <TouchableOpacity 
            key={opt.value} 
            onPress={() => props.onSelect(opt.value)} 
            testID={`option-${opt.value}`}
          >
            <Text>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  });
});

describe('ProjectHeader', () => {
  const mockProject: any = {
    id: '1',
    title: 'Test Project',
    status: 'ACTIVE',
  };

  const mockUpdateProject = jest.fn();
  const mockSetProject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByDisplayValue } = render(
      <ProjectHeader 
        project={mockProject} 
        updateProject={mockUpdateProject}
        setProject={mockSetProject}
      />
    );
    expect(getByDisplayValue('Test Project')).toBeTruthy();
  });

  it('handles name change and blur', () => {
    const { getByDisplayValue } = render(
      <ProjectHeader 
        project={mockProject} 
        updateProject={mockUpdateProject}
        setProject={mockSetProject}
      />
    );
    
    const input = getByDisplayValue('Test Project');
    fireEvent.changeText(input, 'New Name');
    expect(mockSetProject).toHaveBeenCalled();
    
    fireEvent(input, 'blur');
    expect(mockUpdateProject).toHaveBeenCalled();
  });

  it('presents selection sheet on status press', () => {
    const { getAllByText, getByTestId } = render(
      <ProjectHeader 
        project={mockProject} 
        updateProject={mockUpdateProject}
        setProject={mockSetProject}
      />
    );
    
    // Status is 'ACTIVE', label is 'Active'. There are multiple "Active" texts.
    const statusButtons = getAllByText('Active');
    fireEvent.press(statusButtons[0]);
    expect(getByTestId('selection-sheet')).toBeTruthy();
  });
});
