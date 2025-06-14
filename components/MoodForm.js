import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { getRecommendation } from '../api';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants'; // ✅ Import for environment access

const MOOD_OPTIONS = [
  { value: "happy", label: "😊  Happy" },
  { value: "sad", label: "😢  Sad" },
  { value: "angry", label: "😡  Angry" },
  { value: "calm", label: "🧘  Calm" },
  { value: "anxious", label: "😰  Anxious" },
  { value: "romantic", label: "💖  Romantic" }
];

export default function MoodForm({ onResult, onError, darkMode, initialCity }) {
  const [mood, setMood] = useState(null);
  const [city, setCity] = useState(initialCity || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async (query) => {
    try {
      const apiKey = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&key=${apiKey}`
      );

      const data = await response.json();
      const filtered = data.predictions.map(item => item.description.split(',')[0]);
      setSuggestions(filtered);
      if (filtered.length > 0) setShowSuggestions(true);
    } catch (err) {
      console.warn("Could not fetch suggestions:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (city.length >= 2) fetchSuggestions(city);
    else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [city]);

  const handleSubmit = async () => {
    onError(""); onResult(null);
    if (!mood || !city) {
      onError("Please select a mood and enter a city.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await getRecommendation(mood, city);
      onResult(data);
    } catch (err) {
      onError(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      setShowSuggestions(false);
      Keyboard.dismiss();
    }}>
      <View style={[styles.container, { backgroundColor: darkMode ? "#1f2937" : "#ffffff" }]}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#6938fa" />
          </View>
        )}

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
          onFocus={() => {
            if (city.length >= 2) setShowSuggestions(true);
          }}
        />

        {showSuggestions && (
          <View style={styles.suggestionsList}>
            <FlatList
              data={suggestions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    setCity(item);
                    setShowSuggestions(false);
                    Keyboard.dismiss();
                  }}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}

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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 15,
    elevation: 10,
    marginHorizontal: 5,
    marginTop: 20,
    position: 'relative',
    opacity: 0.8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
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
    shadowColor: 'rgba(0,0,0,0.3)',
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
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginTop: -30,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 100,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
});
