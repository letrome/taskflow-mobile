import React from 'react';
import { render } from '@testing-library/react-native';
import ProjectOwner from '../ProjectOwner';

describe('ProjectOwner', () => {
  it('renders owner name correctly', () => {
    const { getByText } = render(<ProjectOwner ownerName="John Doe" />);
    
    expect(getByText(/Created by:/)).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
  });
});
