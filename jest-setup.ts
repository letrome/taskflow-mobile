import '@testing-library/jest-native/extend-expect';

// Add any global mocks here
jest.mock('expo-font', () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
    fromModule: jest.fn(() => ({
      downloadAsync: jest.fn(() => Promise.resolve()),
    })),
  },
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const { useEffect } = require('react');
  return {
    useFocusEffect: jest.fn((cb) => {
      useEffect(() => {
        const cleanup = cb();
        return () => {
          if (typeof cleanup === 'function') cleanup();
        };
      }, [cb]);
    }),
    useNavigation: () => ({
      navigate: jest.fn(),
      setOptions: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useIsFocused: () => true,
  };
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: 'FontAwesome',
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
}));
jest.mock('@expo/vector-icons/FontAwesome', () => 'FontAwesome');

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const mockReact = require('react');
  const mockReactNative = require('react-native');
  const mockView = mockReactNative.View;
  const mockFlatList = mockReactNative.FlatList;
  const mockScrollView = mockReactNative.ScrollView;

  return {
    __esModule: true,
    default: mockView,
    BottomSheetModal: mockReact.forwardRef((props: any, ref: any) => {
      mockReact.useImperativeHandle(ref, () => ({
        dismiss: jest.fn(),
        present: jest.fn(),
        expand: jest.fn(),
        collapse: jest.fn(),
      }));
      return mockReact.createElement(mockView, props);
    }),
    BottomSheetModalProvider: ({ children }: any) => children,
    BottomSheetView: mockView,
    BottomSheetTextInput: mockView,
    BottomSheetFlatList: mockFlatList,
    BottomSheetScrollView: mockScrollView,
    useBottomSheetModal: () => ({
      present: jest.fn(),
      dismiss: jest.fn(),
    }),
  };
});

// Mock react-native Alert globally without overriding everything
const mockReactNative = require('react-native');
if (mockReactNative.Alert) {
  mockReactNative.Alert.alert = jest.fn((title, message, buttons) => {
    if (buttons && buttons.length > 0) {
      const deleteButton = buttons.find((b: any) => b.text === 'Delete' || b.text === 'Delete Task');
      if (deleteButton && deleteButton.onPress) {
        deleteButton.onPress();
      }
    }
  });
}
