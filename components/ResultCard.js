import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';

const MOOD_THEMES = {
  happy:   { color: "#fef08a", icon: "😊" },
  sad:     { color: "#d1d5db", icon: "😢" },
  angry:   { color: "#fca5a5", icon: "😡" },
  calm:    { color: "#bfdbfe", icon: "🧘‍♂️" },
  anxious: { color: "#fcd34d", icon: "😰" },
  romantic:{ color: "#f9a8d4", icon: "💖" },
};

export default function ResultCard({ result, visible, onClose }) {
  if (!visible || !result) return null;

  const { mood, weather, mood_matches_weather, recommended_song } = result;
  const theme = MOOD_THEMES[mood.toLowerCase()] || {};

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.overlay}>
        <Animatable.View animation="zoomIn" duration={400} style={[styles.card, { backgroundColor: theme.color || "#f3f4f6" }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>❌</Text>
          </TouchableOpacity>

          <Text style={styles.icon}>{theme.icon || "🎶"}</Text>
          <Text style={styles.label}>🌤 Weather: {weather}</Text>
          <Text style={styles.label}>
            ❤️ Mood Match: {mood_matches_weather ? "Yes ✅" : "No ❌"}
          </Text>

          {recommended_song ? (
            <>
              <Text style={styles.song}>🎵 {recommended_song.title}</Text>
              <Text style={styles.artist}>🎤 {recommended_song.artist}</Text>
              <TouchableOpacity onPress={() =>
                Linking.openURL(`https://www.youtube.com/results?search_query=${recommended_song.title}+${recommended_song.artist}`)
              }>
                <Text style={styles.link}>🔗 Search on YouTube</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.song}>No song matched this mood-weather combo.</Text>
          )}
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    borderRadius: 20,
    padding: 35,
    elevation: 10,
    position: 'relative',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 2,
  },
  closeText: {
    fontSize: 15,
  },
  icon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  song: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  link: {
    marginTop: 10,
    color: '#1d4ed8',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
