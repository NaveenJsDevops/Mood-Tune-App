import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MoodForm from '../components/MoodForm';
import ResultCard from '../components/ResultCard';

export default function HomeScreen({ navigation, darkMode }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f0f4f8' }]}>

      {/* Settings icon - top left */}
      <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('Settings')}>
        <Text style={[styles.icon, { color: darkMode ? '#f0f4f8' : '#111827' }]}>⋮</Text>
      </TouchableOpacity>

      {/* App title - centered top */}
      <View style={styles.titleWrapper}>
        <Text style={[styles.title, { color: darkMode ? '#f9fafb' : '#4F46E5' }]}>🎵 MoodTune</Text>
      </View>

        <MoodForm
          onResult={(data) => {
            setResult(data);
            setShowResult(true);
          }}
          onError={setError}
          darkMode={darkMode}
        />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {result && <ResultCard result={result} visible={showResult} onClose={() => setShowResult(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  iconWrapper: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  icon: {
    fontSize: 30,
    marginTop: 10,
    paddingLeft: 10,
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
