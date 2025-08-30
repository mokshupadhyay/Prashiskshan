import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Landing } from '../src/screens/Auth/Landing.screen';
import { Login } from '../src/screens/Auth/Login.screen';
import { OTP } from '../src/screens/Auth/OTP.screen';
import { UserDetails } from '../src/screens/Auth/UserDetails.screen';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
    </Stack.Navigator>
  );
};
