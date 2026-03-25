import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskFilterSheet from '../TaskFilterSheet';

// Mock BottomSheet components
jest.mock('@gorhom/bottom-sheet', () => {
  const ReactMock = require('react');
  const { View, ScrollView } = require('react-native');
  return {
    BottomSheetModal: ReactMock.forwardRef(({ children }: any, ref: any) => {
      ReactMock.useImperativeHandle(ref, () => ({
        present: jest.fn(),
        dismiss: jest.fn(),
      }));
      return <View testID="bottom-sheet-modal">{children}</View>;
    }),
    BottomSheetScrollView: ScrollView,
    BottomSheetBackdrop: (props: any) => <View {...props} testID="bottom-sheet-backdrop" />,
  };
});

describe('TaskFilterSheet', () => {
  const mockTaskParams: any = {
    sort: ['state'],
    state: ['OPEN'],
    priority: ['HIGH'],
    tags: ['tag1'],
  };

  const mockSetTaskParams = jest.fn();
  const mockProjectTags = [{ id: 'tag1', name: 'Tag 1' }];
  const mockRef = { current: null };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial params', () => {
    const { getByText } = render(
      <TaskFilterSheet 
        taskParams={mockTaskParams}
        setTaskParams={mockSetTaskParams}
        projectTags={mockProjectTags}
        bottomSheetModalRef={mockRef as any}
      />
    );
    
    expect(getByText('Filters & Sort')).toBeTruthy();
    expect(getByText('Sort by')).toBeTruthy();
    expect(getByText('State')).toBeTruthy();
    expect(getByText('Priority')).toBeTruthy();
    expect(getByText('Tags')).toBeTruthy();
  });

  it('handles sort change (toggle logic)', () => {
    const { getByText } = render(
      <TaskFilterSheet 
        taskParams={mockTaskParams}
        setTaskParams={mockSetTaskParams}
        projectTags={mockProjectTags}
        bottomSheetModalRef={mockRef as any}
      />
    );
    
    // Sort by state (currently 'state', should toggle to '-state')
    fireEvent.press(getByText('State (A-Z)'));
    expect(mockSetTaskParams).toHaveBeenCalled();
    const updateFn = mockSetTaskParams.mock.calls[0][0];
    expect(updateFn({ sort: ['state'] })).toEqual({ sort: ['-state'] });
    
    // Explicit sort by -state
    fireEvent.press(getByText('State (Z-A)'));
    expect(mockSetTaskParams).toHaveBeenCalled();
    
    // Sort by priority (High, Low)
    fireEvent.press(getByText('Priority (High)'));
    fireEvent.press(getByText('Priority (Low)'));
    expect(mockSetTaskParams).toHaveBeenCalledTimes(4);
  });

  it('handles state toggle (remove existing state)', () => {
    const { getByText } = render(
      <TaskFilterSheet 
        taskParams={mockTaskParams}
        setTaskParams={mockSetTaskParams}
        projectTags={mockProjectTags}
        bottomSheetModalRef={mockRef as any}
      />
    );
    
    // Toggle existing state 'OPEN' (should remove it)
    fireEvent.press(getByText('Open'));
    expect(mockSetTaskParams).toHaveBeenCalled();
    const updateFn = mockSetTaskParams.mock.calls[0][0];
    expect(updateFn({ state: ['OPEN'] })).toEqual({ state: [] });
  });

  it('handles tag toggle (remove existing tag)', () => {
    const { getByText } = render(
      <TaskFilterSheet 
        taskParams={mockTaskParams}
        setTaskParams={mockSetTaskParams}
        projectTags={mockProjectTags}
        bottomSheetModalRef={mockRef as any}
      />
    );
    
    // Toggle existing tag 'tag1' (should remove it)
    fireEvent.press(getByText('Tag 1'));
    expect(mockSetTaskParams).toHaveBeenCalled();
    const updateFn = mockSetTaskParams.mock.calls[0][0];
    expect(updateFn({ tags: ['tag1'] })).toEqual({ tags: [] });
  });

  it('handles reset filters', () => {
    const { getByText } = render(
      <TaskFilterSheet 
        taskParams={mockTaskParams}
        setTaskParams={mockSetTaskParams}
        projectTags={mockProjectTags}
        bottomSheetModalRef={mockRef as any}
      />
    );
    
    fireEvent.press(getByText('Reset filters'));
    expect(mockSetTaskParams).toHaveBeenCalledWith({});
  });
});
