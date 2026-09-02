import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types';
import { CustomTabBar } from './CustomTabBar';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ScannerScreen } from '../screens/Scanner/ScannerScreen';
import { RoutineScreen } from '../screens/Routine/RoutineScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const AppTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ScannerTab" component={ScannerScreen} />
      <Tab.Screen name="RoutineTab" component={RoutineScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
