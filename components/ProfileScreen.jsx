import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Aktiver layout animation på Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ProfileScreen({ route, navigation }) {
  const [routeUserName, setRouteUserName] = useState('Ukendt spiller');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [user, setUser] = useState(null);

  // Rutehistorik
  const [routes, setRoutes] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const loadRoutes = async () => {
        const stored = await AsyncStorage.getItem('routes');
        setRoutes(stored ? JSON.parse(stored) : []);
      };
      loadRoutes();
    }, [])
  );

  const loadData = async () => {
    try {
      const storedXP = await AsyncStorage.getItem('xp');
      const totalXP = storedXP ? parseInt(storedXP) : 0;
      setXp(totalXP);
      setLevel(Math.floor(totalXP / 1000) + 1);

      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setRouteUserName(parsed.name);
      }
    } catch (error) {
      console.error('Fejl ved hentning af data:', error);
    }
  };

  const progress = (xp % 1000) / 1000;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const clearAllRoutes = async () => {
    Alert.alert(
      'Bekræft sletning',
      'Er du sikker på, at du vil slette alle gemte ruter?',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Slet alt',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('routes');
              setRoutes([]);
              Alert.alert('Slettet', 'Alle ruter er nu slettet.');
            } catch (error) {
              Alert.alert('Fejl', 'Kunne ikke slette ruter.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      {/* 🔹 Top-bjælke med hundeinfo */}
      {user && (
        <View style={styles.infoBar}>
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.dogName}>{user.dog.name}</Text>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Ionicons name="create-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.infoText}>Ejer: {user.name}</Text>
            <Text style={styles.infoText}>Race: {user.dog.breed}</Text>
            <Text style={styles.infoText}>Alder: {user.dog.age}</Text>
          </View>

          {user.dog.image ? (
            <Image source={{ uri: user.dog.image }} style={styles.dogImage} />
          ) : (
            <View style={[styles.dogImage, styles.placeholder]}>
              <Text style={{ color: '#ccc' }}>Ingen billede</Text>
            </View>
          )}
        </View>
      )}

      {/* 🔹 Venstrestillet profilsektion */}
      <View style={styles.profileHeader}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.userName}>{routeUserName}</Text>
      </View>

      {/* 🔹 Level som progressbar */}
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelText}>Level {level}</Text>
        <Text style={styles.xpText}>{xp % 1000} / 1000 XP</Text>
        </View>
        <ProgressBar progress={progress} color="#49ff86ff" style={styles.levelBar} />
      </View>

      {/* 🔹 Rutehistorik */}
      <View style={{ width: '90%', marginTop: 30 }}>
        <TouchableOpacity style={styles.boxHeader} onPress={toggleExpand} activeOpacity={0.8}>
          <Text style={styles.boxTitle}>Rutehistorik</Text>
          <Ionicons
            name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={22}
            color="white"
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.boxContent}>
            <FlatList
              data={routes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.routeItem}>
                  <Text style={styles.routeText}>📅 {new Date(item.date).toLocaleDateString()}</Text>
                  <Text style={styles.routeText}>📏 {item.distance} km</Text>
                  <Text style={styles.routeText}>⏱ {formatTime(item.duration)}</Text>
                </View>
              )}
              style={styles.routesList}
              contentContainerStyle={{ paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<Text style={styles.noData}>Ingen ruter gemt endnu</Text>}
              ListFooterComponent={
                routes.length > 0 ? (
                  <TouchableOpacity style={styles.clearButton} onPress={clearAllRoutes}>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={styles.clearButtonText}>Slet alle ruter</Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#FAF3E0',
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E5B31',
    width: '90%',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dogName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  editIcon: {
    marginLeft: 8,
    padding: 4,
  },
  infoText: {
    fontSize: 16,
    color: 'white',
  },
  dogImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginLeft: 15,
  },
  placeholder: {
    backgroundColor: '#3A7C58',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileHeader: {
    width: '90%',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E5B31',
  },
  userName: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },

  levelContainer: {
    width: '90%',
    marginTop: 10,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E5B31',
  },
  xpText: {
    fontSize: 16,
    color: '#555',
  },
  levelBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },

  boxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E5B31',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  boxTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  boxContent: {
    backgroundColor: '#1E5B31',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  routesList: {
    maxHeight: 320, // justér evt. 280–420 afhængigt af dit layout/skærm
  },
  routeItem: {
    padding: 10,
    backgroundColor: '#FAF3E0',
    borderRadius: 8,
    marginBottom: 8,
  },
  routeText: {
    color: '#333',
  },
  noData: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'white',
    paddingVertical: 10,
  },
  clearButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
