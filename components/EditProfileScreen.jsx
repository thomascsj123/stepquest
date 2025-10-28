import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const stored = await AsyncStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Tilladelse nægtet', 'Du skal give adgang til billeder');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUser({ ...user, dog: { ...user.dog, image: result.assets[0].uri } });
    }
  };

  const saveChanges = async () => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      Alert.alert('Gemte ændringer', 'Dine oplysninger er opdateret 🐾', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Fejl', 'Kunne ikke gemme ændringer.');
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Rediger Profil</Text>

        <TextInput
          style={styles.input}
          placeholder="Ejerens navn"
          placeholderTextColor="#e0e0e0"
          value={user.name}
          onChangeText={(t) => setUser({ ...user, name: t })}
        />

        <TextInput
          style={styles.input}
          placeholder="Hundens navn"
          placeholderTextColor="#e0e0e0"
          value={user.dog.name}
          onChangeText={(t) => setUser({ ...user, dog: { ...user.dog, name: t } })}
        />

        <TextInput
          style={styles.input}
          placeholder="Race"
          placeholderTextColor="#e0e0e0"
          value={user.dog.breed}
          onChangeText={(t) => setUser({ ...user, dog: { ...user.dog, breed: t } })}
        />

        <TextInput
          style={styles.input}
          placeholder="Alder"
          placeholderTextColor="#e0e0e0"
          keyboardType="numeric"
          value={String(user.dog.age)}
          onChangeText={(t) => setUser({ ...user, dog: { ...user.dog, age: t } })}
        />

        {user.dog.image && <Image source={{ uri: user.dog.image }} style={styles.image} />}

        {/* Grøn knap: Vælg nyt billede */}
        <TouchableOpacity style={styles.greenBtn} onPress={pickImage} activeOpacity={0.9}>
          <Text style={styles.greenBtnText}>Vælg nyt billede</Text>
        </TouchableOpacity>

        {/* Grøn knap: Gem ændringer */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.greenBtn} onPress={saveChanges} activeOpacity={0.9}>
            <Text style={styles.greenBtnText}>Gem ændringer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF3E0',
    paddingTop: 20,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FAF3E0',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E5B31',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 45,
    backgroundColor: '#1E5B31',
    color: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 15,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  greenBtn: {
    width: '100%',
    backgroundColor: '#1E5B31',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  greenBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
