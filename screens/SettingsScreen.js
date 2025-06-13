import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { pingServer } from '../api';

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2
  },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'left', fontSize: 16, gap: 10 },
  statusBox: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusText: {
    color: '#111827',
    fontWeight: '500',
    textAlign: 'center'
  }
});
