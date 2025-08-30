import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../src/screens/Main/Dashboard.screen';
import { WebViewDashboard } from '../src/screens/Main/WebViewDashboard.screen';

const Stack = createNativeStackNavigator();
export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WebViewDashboard" component={WebViewDashboard} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};
