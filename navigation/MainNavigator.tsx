import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../src/context/AuthContext';
import { StudentDashboard } from '../src/screens/Main/StudentDashboard.screen';
import { MentorDashboard } from '../src/screens/Main/MentorDashboard.screen';
import { RecruiterDashboard } from '../src/screens/Main/RecruiterDashboard.screen';
import { AttendanceTracking } from '../src/screens/Main/AttendanceTracking.screen';
import { AcademicCredits } from '../src/screens/Main/AcademicCredits.screen';
import { Reports } from '../src/screens/Main/Reports.screen';
import { Interviews } from '../src/screens/Main/Interviews.screen';
import { Browse } from '../src/screens/Main/Browse.screen';
import { Messages } from '../src/screens/Main/Messages.screen';
import { Resume } from '../src/screens/Main/Resume.screen';
import { Schedule } from '../src/screens/Main/Schedule.screen';
import Dashboard from '../src/screens/Main/Dashboard.screen';

export type MainStackParamList = {
  Dashboard: undefined;
  AttendanceTracking: undefined;
  Reports: undefined;
  Interviews: undefined;
  AcademicCredits: undefined;
  Analytics: undefined;
  Messages: undefined;
  Browse: undefined;
  Resume: undefined;
  Schedule: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

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
      <Stack.Screen name="AttendanceTracking" component={AttendanceTracking} />
      <Stack.Screen name="AcademicCredits" component={AcademicCredits} />
      <Stack.Screen name="Reports" component={Reports} />
      <Stack.Screen name="Interviews" component={Interviews} />
      <Stack.Screen name="Browse" component={Browse} />
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen name="Resume" component={Resume} />
      <Stack.Screen name="Schedule" component={Schedule} />
    </Stack.Navigator>
  );
};
