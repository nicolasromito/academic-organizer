
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppStore } from './src/context/AppContext';

import HomeScreen from './src/screens/HomeScreen';
import MateriasScreen from './src/screens/MateriasScreen';
import MateriaDetailScreen from './src/screens/MateriaDetailScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MateriasStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MateriasList" component={MateriasScreen} />
      <Stack.Screen name="MateriaDetail" component={MateriaDetailScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  const { initApp } = useAppStore();

  useEffect(() => {
    initApp();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#7C3AED',
          tabBarInactiveTintColor: '#9CA3AF',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Inicio',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
          }}
        />
        <Tab.Screen
          name="Materias"
          component={MateriasStack}
          options={{
            tabBarLabel: 'Materias',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📚</Text>,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarLabel: 'Calendario',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📅</Text>,
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarLabel: 'Estadísticas',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Configuración',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}