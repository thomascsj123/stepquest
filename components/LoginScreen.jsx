import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, SigmarOne_400Regular } from '@expo-google-fonts/sigmar-one';

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [fontsLoaded] = useFonts({
    SigmarOne_400Regular,
  });

  if (!fontsLoaded) {
    return null; // venter på font
  }

  const handleLogin = async () => {
    if (name.trim() === '' || password.trim() === '') {
      Alert.alert('Manglende oplysninger', 'Udfyld både navn og kode!');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        Alert.alert('Ingen bruger fundet', 'Opret en konto først.');
        return;
      }

      const user = JSON.parse(storedUser);
      if (user.name === name && user.password === password) {
        navigation.replace('MainTabs', {
          screen: 'WalkSelection',
          params: { userName: user.name },
        });
      } else {
        Alert.alert('Forkert login', 'Navn eller adgangskode er forkert.');
      }
    } catch (error) {
      console.error('Fejl ved login:', error);
      Alert.alert('Fejl', 'Noget gik galt under login.');
    }
  };

  return (
    <View style={styles.screen}>
      {/* 🔹 Header med logo */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logo}>SnudeQuest</Text>
          <Ionicons name="paw" size={34} color="white" style={{ marginLeft: 6 }} />
        </View>
      </View>

      {/* 🔹 Boksen med pote-baggrund */}
      <ImageBackground
        source={require('../img/paws_bg.png')}
        style={styles.boxBackground}
        imageStyle={{ borderRadius: 25 }}
        resizeMode="cover"
      >
        <View style={styles.boxContent}>
          <Text style={styles.title}>LOG IND</Text>

          <TextInput
            style={styles.input}
            placeholder="Brugernavn"
            placeholderTextColor="#d6e6d3"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Kodeord"
            placeholderTextColor="#d6e6d3"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>LOG IND</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Har du ikke en bruger?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Register')}
            >
              Opret bruger
            </Text>
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1E5B31', // Mørkegrøn baggrund
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 38,
    fontFamily: 'SigmarOne_400Regular',
    color: 'white',
    letterSpacing: 1,
  },
  boxBackground: {
    width: '100%',
    height: 450, // Sørger for at paws_bg fylder hele boksen
    backgroundColor: '#FAF3E0',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  boxContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E5B31',
    marginBottom: 25,
  },
  input: {
    width: '90%',
    backgroundColor: '#1E5B31',
    color: 'white',
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: '#1E5B31',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 10,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  footerText: {
    marginTop: 25,
    color: '#333',
    fontSize: 14,
  },
  link: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#1E5B31',
  },
});
