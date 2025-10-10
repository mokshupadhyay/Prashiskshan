import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../src/context/AuthContext';
import { StudentDashboard } from '../src/screens/Main/StudentDashboard.screen';
import { MentorDashboard } from '../src/screens/Main/MentorDashboard.screen';
import { RecruiterDashboard } from '../src/screens/Main/RecruiterDashboard.screen';
import Dashboard from '../src/screens/Main/Dashboard.screen';

const Stack = createNativeStackNavigator();

export const MainNavigator = () => {
  const { user } = useAuth();

  // Determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'student':
        return StudentDashboard;
      case 'mentor':
        return MentorDashboard;
      case 'recruiter':
        return RecruiterDashboard;
      default:
        return Dashboard; // Fallback to original dashboard
    }
  };

  const DashboardComponent = getDashboardComponent();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardComponent} />
    </Stack.Navigator>
  );
};
