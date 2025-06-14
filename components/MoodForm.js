import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getRecommendation } from '../api';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const MOOD_OPTIONS = [
  { value: "happy", label: "😊  Happy" },
  { value: "sad", label: "😢  Sad" },
  { value: "angry", label: "😡  Angry" },
  { value: "calm", label: "🧘  Calm" },
  { value: "anxious", label: "😰  Anxious" },
  { value: "romantic", label: "💖  Romantic" }
];

export default function MoodForm({ onResult, onError, darkMode }) {
  const [mood, setMood] = useState(null);
  const [city, setCity] = useState('');

  const handleSubmit = async () => {
    onError(""); onResult(null);
    if (!mood || !city) {
      onError("Please select a mood and enter a city.");
      return;
    }

    try {
      const data = await getRecommendation(mood, city);
      onResult(data);
    } catch (err) {
      onError(err?.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#1f2937" : "#ffffff" }]}>
      <Text style={[styles.label, { color: darkMode ? "#e5e7eb" : "#000" }]}>🌆 Which city are you in?</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: '#f3f4f6',
            borderColor: '#6938fa',
            color: darkMode ? '#e5e7eb' : '#000'
          }
        ]}
        placeholder="e.g., London"
        value={city}
        onChangeText={setCity}
        placeholderTextColor="#666"
      />

      <Text style={[styles.label, { color: darkMode ? "#e5e7eb" : "#000" }]}>🙂 How do you feel today?</Text>
      <View style={styles.grid}>
        {MOOD_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodButton,
              mood === option.value && styles.selectedMood
            ]}
            onPress={() => setMood(option.value)}
          >
            <Text style={[
              styles.moodText,
              mood === option.value && styles.selectedMoodText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animatable.View animation="pulse" iterationCount="infinite" duration={1000}>
        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.9}>
          <LinearGradient
            colors={['#203e5f', '#86a6df']}
            start={[0.1, 0.2]}
            end={[1, 1]}
            style={styles.recommendButton}
          >
            <Text style={styles.recommendText}>🎧 Recommend a Song</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 15,
    elevation: 10,
    marginHorizontal: 5,
    marginTop: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 25,
  },
  moodButton: {
    width: '45%',
    backgroundColor: '#f3f4f6',
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedMood: {
    backgroundColor: '#284474',
  },
  moodText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  selectedMoodText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 35,
  },
  recommendButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recommendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
});
