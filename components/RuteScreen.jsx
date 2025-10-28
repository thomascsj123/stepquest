import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import haversine from 'haversine-distance';

export default function RuteScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const mapRef = useRef(null);
  const watchRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Tilladelse til lokation blev nægtet');
        return;
      }
      const current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);
    })();

    return () => stopTracking();
  }, []);

  const startTracking = async () => {
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setEarnedXP(0);
    startTimeRef.current = new Date();
    setTracking(true);

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((new Date() - startTimeRef.current) / 1000);
      setDuration(elapsed);
    }, 1000);

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 2,
      },
      (pos) => {
        const coords = pos.coords;
        setLocation(coords);
        setRoute((prev) => {
          const newRoute = [...prev, coords];
          if (newRoute.length > 1) {
            const last = newRoute[newRoute.length - 2];
            const d = haversine(
              { lat: last.latitude, lon: last.longitude },
              { lat: coords.latitude, lon: coords.longitude }
            );
            const km = d / 1000;
            setDistance((prevDistance) => prevDistance + km);
            setEarnedXP((prevXP) => prevXP + Math.floor(d)); // 1 XP per meter
          }
          return newRoute;
        });

        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: { latitude: coords.latitude, longitude: coords.longitude },
            zoom: 16,
          });
        }
      }
    );
  };

  const stopTracking = async () => {
    setTracking(false);

    if (watchRef.current) {
      await watchRef.current.remove();
      watchRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!route || route.length === 0) {
      Alert.alert('Ingen data', 'Der blev ikke registreret nogen rute.');
      return;
    }

    const newRoute = {
      id: Date.now(),
      date: new Date().toISOString(),
      distance: distance.toFixed(2),
      duration,
      route,
    };

    try {
      const stored = await AsyncStorage.getItem('routes');
      const routes = stored ? JSON.parse(stored) : [];
      const updatedRoutes = [newRoute, ...routes];
      await AsyncStorage.setItem('routes', JSON.stringify(updatedRoutes));

      const storedXP = await AsyncStorage.getItem('xp');
      const currentXP = storedXP ? parseInt(storedXP) : 0;
      const newXP = currentXP + earnedXP;
      await AsyncStorage.setItem('xp', newXP.toString());

      Alert.alert('Rute gemt', `Din rute blev gemt 🐾\n+${earnedXP} XP optjent!`);
    } catch (error) {
      console.error('Fejl ved gemning:', error);
      Alert.alert('Fejl', 'Kunne ikke gemme ruten 😢');
    }
  };

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#42a4ff" />
        <Text>Henter din placering...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      


      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {route.length > 0 && (
          <>
            <Polyline
              coordinates={route.map((p) => ({
                latitude: p.latitude,
                longitude: p.longitude,
              }))}
              strokeColor="#42a4ff"
              strokeWidth={5}
            />
            <Marker coordinate={route[0]} title="Start" pinColor="green" />
            <Marker
              coordinate={route[route.length - 1]}
              title="Slut"
              pinColor="red"
            />
          </>
        )}
      </MapView>

      <View style={styles.info}>
        <Text>Distance: {distance.toFixed(2)} km</Text>
        <Text>Tid: {formatTime(duration)}</Text>
        <Text>XP: {earnedXP}</Text>
      </View>

      <View style={styles.controlsBox}>
  <View style={styles.controls}>
    {!tracking ? (
      <Button title="Start ny rute" onPress={startTracking} color="#ffffffff" />
    ) : (
      <Button title="Slut rute" onPress={stopTracking} color="#ff4242" />
    )}
  </View>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 20,
    elevation: 4,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 200,
  },
  info: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsBox: {
  position: 'absolute',
  bottom: 30,
  alignSelf: 'center',
  backgroundColor: '#1E5B31', // ✅ grøn farve
  padding: 5,
  borderRadius: 15,
  elevation: 6,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 5,
},
controls: {
  width: 150,
},
});
