import React from 'react';
import { render } from '@testing-library/react-native';
import ProjectDetailsCard from '../ProjectDetailsCard';

// Mock sub-components
jest.mock('../ProjectDates', () => {
  const { Text } = require('react-native');
  return () => <Text>ProjectDates Mock</Text>;
});
jest.mock('../ProjectDescription', () => {
  const { Text } = require('react-native');
  return () => <Text>ProjectDescription Mock</Text>;
});
jest.mock('../ProjectOwner', () => {
  const { Text } = require('react-native');
  return ({ ownerName }: { ownerName: string }) => <Text>Owner: {ownerName}</Text>;
});

describe('ProjectDetailsCard', () => {
  const mockProject: any = {
    id: '1',
    title: 'Test Project',
    created_by: 'Original Owner',
  };

  const mockSetProject = jest.fn();
  const mockUpdateProject = jest.fn();

  it('renders correctly with project owner', () => {
    const mockOwner: any = { first_name: 'John', last_name: 'Doe' };
    const { getByText } = render(
      <ProjectDetailsCard 
        project={mockProject} 
        projectOwner={mockOwner}
        setProject={mockSetProject}
        updateProject={mockUpdateProject}
      />
    );
    
    expect(getByText('ProjectDescription Mock')).toBeTruthy();
    expect(getByText('ProjectDates Mock')).toBeTruthy();
    expect(getByText('Owner: John Doe')).toBeTruthy();
  });

  it('renders correctly without project owner (using created_by)', () => {
    const { getByText } = render(
      <ProjectDetailsCard 
        project={mockProject} 
        projectOwner={null}
        setProject={mockSetProject}
        updateProject={mockUpdateProject}
      />
    );
    
    expect(getByText('Owner: Original Owner')).toBeTruthy();
  });
});
