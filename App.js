import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();
const STORAGE_KEY = 'MOODTUNE_THEME';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value !== null) {
          setDarkMode(value === 'true');
        }
      } catch (e) {
        console.error("Failed to load theme preference:", e);
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = async () => {
    try {
      const newValue = !darkMode;
      setDarkMode(newValue);
      await AsyncStorage.setItem(STORAGE_KEY, String(newValue));
    } catch (e) {
      console.error("Failed to save theme preference:", e);
    }
  };

  if (loading || showSplash) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MoodTune">
        <Stack.Screen name="MoodTune" options={{ headerShown: false }}>
          {(props) => <HomeScreen {...props} darkMode={darkMode} />}
        </Stack.Screen>
        <Stack.Screen name="Settings">
          {(props) => (
            <SettingsScreen {...props} darkMode={darkMode} setDarkMode={toggleDarkMode} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
