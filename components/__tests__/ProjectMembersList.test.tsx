import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ProjectMembersList from '../ProjectMembersList';
import { userApi } from '@/services/user-api';

// Mock userApi
jest.mock('@/services/user-api', () => ({
  userApi: {
    searchUsers: jest.fn(),
  },
}));

describe('ProjectMembersList', () => {
  const mockMembers = [
    { id: '1', first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com' },
    { id: '2', first_name: 'Bob', last_name: 'Jones', email: 'bob@example.com' },
  ];

  const mockOnAdd = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing if not editable and members are empty', () => {
    const { toJSON } = render(<ProjectMembersList projectMembers={[]} editable={false} />);
    expect(toJSON()).toBeNull();
  });

  it('handles search error and empty results', async () => {
    (userApi.searchUsers as jest.Mock).mockRejectedValue(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(
      <ProjectMembersList projectMembers={mockMembers} editable={true} />
    );
    
    fireEvent.press(getByText('Add member'));
    fireEvent.changeText(getByPlaceholderText('Search for a user...'), 'Charlie');
    
    await waitFor(() => {
      expect(getByText('No users found')).toBeTruthy();
    });
    consoleSpy.mockRestore();
  });

  it('handles selecting a user from search results', async () => {
    const mockSearchResults = [
      { id: '3', first_name: 'Charlie', last_name: 'Brown', email: 'charlie@example.com' },
    ];
    (userApi.searchUsers as jest.Mock).mockResolvedValue({ ok: true, data: mockSearchResults });

    const { getByText, getByPlaceholderText } = render(
      <ProjectMembersList 
        projectMembers={mockMembers} 
        editable={true} 
        onAddProjectMember={mockOnAdd} 
      />
    );
    
    fireEvent.press(getByText('Add member'));
    fireEvent.changeText(getByPlaceholderText('Search for a user...'), 'Charlie');
    
    await waitFor(() => {
      expect(getByText('Charlie Brown')).toBeTruthy();
    });
    
    fireEvent.press(getByText('Charlie Brown'));
    expect(mockOnAdd).toHaveBeenCalledWith(mockSearchResults[0]);
  });

  it('handles deleting a member', () => {
    const { getByTestId } = render(
      <ProjectMembersList 
        projectMembers={mockMembers} 
        editable={true} 
        onDeleteProjectMember={mockOnDelete} 
      />
    );
    
    fireEvent.press(getByTestId('delete-member-1'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('cancels adding a member', () => {
    const { getByText, getByPlaceholderText, queryByPlaceholderText, getByTestId } = render(
      <ProjectMembersList projectMembers={mockMembers} editable={true} />
    );
    
    fireEvent.press(getByText('Add member'));
    expect(getByPlaceholderText('Search for a user...')).toBeTruthy();
    
    fireEvent.press(getByTestId('cancel-add-member'));
    expect(queryByPlaceholderText('Search for a user...')).toBeNull();
  });
});
