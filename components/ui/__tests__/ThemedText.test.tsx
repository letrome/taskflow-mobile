import { render } from '@testing-library/react-native';
import { Text } from '../Themed';
import { useColorScheme } from 'react-native';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(),
}));

describe('Text', () => {
  it('renders correctly', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const { getByText } = render(<Text>Hello</Text>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('applies light color correctly', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const { getByText } = render(
      <Text lightColor="#ff0000">Hello</Text>
    );
    expect(getByText('Hello').props.style).toContainEqual(
      expect.objectContaining({ color: '#ff0000' })
    );
  });
});
