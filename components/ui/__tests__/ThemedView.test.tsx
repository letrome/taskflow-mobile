import { render } from '@testing-library/react-native';
import { View } from '../Themed';
import { useColorScheme } from 'react-native';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(),
}));

describe('View', () => {
  it('renders correctly', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const { getByTestId } = render(
      <View testID="themed-view">
        <></>
      </View>
    );
    expect(getByTestId('themed-view')).toBeTruthy();
  });
});
