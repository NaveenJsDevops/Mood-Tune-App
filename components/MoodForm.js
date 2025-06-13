import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getRecommendation } from '../api';

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
            <Text style={styles.moodText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: darkMode ? "#e5e7eb" : "#000" }]}>🌆 Which city are you in?</Text>
      <TextInput
        style={styles.input, {color: darkMode ? "#e5e7eb" : "#000"}}
        placeholder="e.g., London"
        value={city}
        onChangeText={setCity}
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.recommendButton} onPress={handleSubmit}>
        <Text style={styles.recommendText}>🎧 Recommend a Song</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginHorizontal: 10,
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
    backgroundColor: '#6938fa',
  },
  moodText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6938fa',
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 15,
  },
  recommendButton: {
    backgroundColor: '#6D28D9',
    padding: 16,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
  },
  recommendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
