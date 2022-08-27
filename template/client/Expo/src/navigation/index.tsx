import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../screens';
import { RootStackParamList } from '../types/Navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
interface IProps { }

const Navigation: React.FC<IProps> = ({ }) => {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name='Home' component={Home} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Navigation;

