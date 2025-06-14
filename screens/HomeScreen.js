import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import MoodForm from '../components/MoodForm';
import ResultCard from '../components/ResultCard';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const EMOJIS = [
  '😊', '😢', '😡', '🧘', '😰', '💖', '🥰', '🤬', '🥶',
  '🎼', '🎹', '😍', '😴', '😇', '🤓', '🎵', '🎶'
];

export default function HomeScreen({ navigation, darkMode }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);

  const animations = useRef(
    EMOJIS.map(() => ({
      x: new Animated.Value(Math.random() * (width - 50)),
      y: new Animated.Value(Math.random() * (height - 100)),
    }))
  ).current;

  useEffect(() => {
    const animateEmoji = (x, y) => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(x, {
              toValue: Math.random() * (width - 50),
              duration: 8000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
            Animated.timing(x, {
              toValue: Math.random() * (width - 50),
              duration: 8000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(y, {
              toValue: Math.random() * (height - 100),
              duration: 8000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
            Animated.timing(y, {
              toValue: Math.random() * (height - 100),
              duration: 8000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animations.forEach(({ x, y }) => animateEmoji(x, y));
  }, []);

  useEffect(() => {
    const getLocationAndCity = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Please enter your city manually.');
        setLoading(false);
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        let addressList = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (addressList.length > 0) {
          const detectedCity = addressList[0].city || addressList[0].region;
          setCity(detectedCity);
        }
      } catch (err) {
        setError('Could not detect your city. Please enter it manually.');
      } finally {
        setLoading(false);
      }
    };
    getLocationAndCity();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#f0f4f8' }]}>

      {/* 🎈 Animated Emoji Background */}
      <View style={styles.emojiLayer} pointerEvents="none">
        {animations.map((anim, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.emoji,
              {
                transform: [
                  { translateX: anim.x },
                  { translateY: anim.y },
                ],
              },
            ]}
          >
            {EMOJIS[index]}
          </Animated.Text>
        ))}
      </View>

      {/* ⋮ Settings Icon */}
      <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('Settings')}>
        <Text style={[styles.icon, { color: darkMode ? '#f0f4f8' : '#111827' }]}>⋮</Text>
      </TouchableOpacity>

      {/* 🎵 Title */}
      <View style={styles.titleWrapper}>
        <Text style={[styles.title, { color: darkMode ? '#115173' : '#053f5e' }]}>🎵 MoodTune</Text>
      </View>

      {/* 🧭 Location/City Based Input */}
      {loading ? (
        <ActivityIndicator size="large" color="#284474" style={{ marginTop: 20 }} />
      ) : (
        <MoodForm
          initialCity={city}
          onResult={(data) => {
            setResult(data);
            setShowResult(true);
          }}
          onError={setError}
          darkMode={darkMode}
        />
      )}

      {/* ❌ Error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* 🎶 Result */}
      {result && (
        <ResultCard result={result} visible={showResult} onClose={() => setShowResult(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  emojiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  emoji: {
    position: 'absolute',
    fontSize: 50,
    opacity: 0.4,
  },
  iconWrapper: {
    position: 'absolute',
    top: 35,
    left: 30,
    zIndex: 4,
  },
  icon: {
    fontSize: 40,
    marginTop: 5,
    paddingLeft: 5,
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    zIndex: 2,
  },
});
