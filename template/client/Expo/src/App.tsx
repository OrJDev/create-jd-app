import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Navigation />
        <StatusBar hidden />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
