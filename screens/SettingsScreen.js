import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { pingServer } from '../api';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation, darkMode, setDarkMode }) {
  const [pingStatus, setPingStatus] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: darkMode ? '#111827' : '#f9fafb',
      },
      headerTintColor: darkMode ? '#ffffff' : '#000000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      title: 'Settings',
    });
  }, [darkMode]);

  const testPing = async () => {
    try {
      const res = await pingServer();
      const message = res.status === "ok" ? "Connected to server successfully" : "Unexpected response";
      setPingStatus(message);
      setTimeout(() => setPingStatus(null), 2000);
    } catch {
      setPingStatus("❌ Server is not reachable");
      setTimeout(() => setPingStatus(null), 2000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f9fafb' }]}>
      <TouchableOpacity style={styles.button} onPress={() => setDarkMode(!darkMode)}>
        <Text style={styles.buttonText}>
          {darkMode ? "☀️  Switch to Light Mode" : "🌙  Switch to Dark Mode"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testPing}>
        <Text style={styles.buttonText}>🔍  Server Health Check</Text>
      </TouchableOpacity>

      {pingStatus && (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{pingStatus}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <MaterialIcons name="code" size={18} color={darkMode ? "#fff" : "#000"} />
        <Text style={[styles.footerText, { color: darkMode ? '#fff' : '#000' }]}> Developed by </Text>
        <LinearGradient
          colors={['#4f46e5', '#9333ea']}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.gradientTextBox}
        >
          <Text style={styles.gradientText}>Naveen Kumar</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  button: {
    backgroundColor: '#284474',
    padding: 20,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 2
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'left',
    fontSize: 16,
  },
  statusBox: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusText: {
    color: '#284474',
    fontWeight: '500',
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  gradientTextBox: {
    marginLeft: 4,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  gradientText: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#fff',
  },
});
