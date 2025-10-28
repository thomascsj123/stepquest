import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';

export default function WalkSelectionScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    loadUser();
    loadRoutes();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Fejl ved hentning af bruger:', error);
    }
  };

  const loadRoutes = async () => {
    try {
      const storedRoutes = await AsyncStorage.getItem('routes');
      if (storedRoutes) setRoutes(JSON.parse(storedRoutes));
    } catch (error) {
      console.error('Fejl ved hentning af ruter:', error);
    }
  };

  // Naviger til Rute-fanen i MainTabs
  const handleSelectRoute = (km) => {
    navigation.navigate('MainTabs', {
      screen: 'Rute',
      params: { distanceGoal: km },
    });
  };

  // Beregn progress (baseret på samlede kilometer gået)
  const totalDistance = routes.reduce((acc, r) => acc + parseFloat(r.distance || 0), 0);
  const progress = Math.min((totalDistance % 6) / 6, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hej {user?.name || 'Ven'}! Walkietid?{' '}
        <Ionicons name="paw" size={22} color="#654321" />
      </Text>
      <Text style={styles.dogInfo}>
        {user?.dog?.name || ''} {user?.dog?.age ? `${user.dog.age} år` : ''}
      </Text>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.kmLabels}>
          <Text>1 KM</Text>
          <Text>2 KM</Text>
          <Text>3 KM</Text>
          <Text>4 KM</Text>
          <Text>5 KM</Text>
          <Text>6 KM</Text>
        </View>
        <ProgressBar progress={progress} color="#654321" style={styles.progressBar} />
      </View>

      {/* Rutevalg */}
      <View style={styles.routeBox}>
        <Text style={styles.sectionTitle}>Vælg en rute</Text>
        <View style={styles.routeButtons}>
          {[2, 5, 8, 10].map((km) => (
            <TouchableOpacity
              key={km}
              style={styles.routeBtn}
              onPress={() => handleSelectRoute(km)}
            >
              <Text style={styles.routeText}>{km} km</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.customBtn}
          onPress={() => handleSelectRoute(null)}
        >
          <Text style={styles.routeText}>Gå egen rute</Text>
        </TouchableOpacity>
      </View>

      {/* Gemte ruter */}
      <Text style={styles.savedTitle}>GEMTE RUTER</Text>
      <FlatList
        data={routes.slice(0, 2)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.savedRoute}>
            <Ionicons name="paw" size={26} color="white" />
            <View>
              <Text style={styles.savedText}>TUR M. {user?.dog?.name || 'Hund'}</Text>
              <Text style={styles.savedSub}>{item.distance} km</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.arrangeBtn}
        onPress={() => navigation.navigate('FindFriends')}
      >
        <Text style={styles.arrangeText}>Arranger en gåtur med andre ejere</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E0',
    padding: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4B3D2A',
    marginTop: 60,
  },
  dogInfo: {
    fontSize: 18,
    color: '#4B3D2A',
    marginBottom: 10,
  },
  progressSection: {
    marginBottom: 25,
  },
  kmLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EADBC8',
  },
  routeBox: {
    backgroundColor: '#1E5B31',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  routeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  routeBtn: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 12,
    width: '40%', // 🔹 Ens længde for alle knapper
    alignItems: 'center',
    marginVertical: 6,
  },
  customBtn: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  routeText: {
    fontWeight: 'bold',
    color: '#1E5B31',
    fontSize: 16,
  },
  savedTitle: {
    marginTop: 25,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B3D2A',
  },
  savedRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E5B31',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    gap: 10,
  },
  savedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  savedSub: {
    color: 'white',
    fontSize: 14,
  },
  arrangeBtn: {
    backgroundColor: '#1E5B31',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  arrangeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
