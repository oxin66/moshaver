import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './src/supabaseClient';

import ScheduleScreen from './src/screens/ScheduleScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import GamificationScreen from './src/screens/GamificationScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Gamification" component={GamificationScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session && session.user ? (
          <Stack.Screen name="Home" component={AppTabs} />
        ) : (
          <>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
