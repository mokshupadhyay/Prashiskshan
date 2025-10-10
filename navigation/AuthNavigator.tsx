import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Landing } from '../src/screens/Auth/Landing.screen';
import { Login } from '../src/screens/Auth/Login.screen';
import { OTP } from '../src/screens/Auth/OTP.screen';
import { UserDetails } from '../src/screens/Auth/UserDetails.screen';
import { RoleSelection } from '../src/screens/Auth/RoleSelection.screen';
import { StudentProfileSetup } from '../src/screens/Auth/StudentProfileSetup.screen';
import { MentorProfileSetup } from '../src/screens/Auth/MentorProfileSetup.screen';
import { RecruiterProfileSetup } from '../src/screens/Auth/RecruiterProfileSetup.screen';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="RoleSelection" component={RoleSelection} />
      <Stack.Screen name="StudentProfileSetup" component={StudentProfileSetup} />
      <Stack.Screen name="MentorProfileSetup" component={MentorProfileSetup} />
      <Stack.Screen name="RecruiterProfileSetup" component={RecruiterProfileSetup} />
    </Stack.Navigator>
  );
};
