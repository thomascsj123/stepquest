import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, SigmarOne_400Regular } from '@expo-google-fonts/sigmar-one';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    SigmarOne_400Regular,
  });

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogAge, setDogAge] = useState('');
  const [dogGender, setDogGender] = useState('Han');
  const [dogImage, setDogImage] = useState(null);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

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
      setDogImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedPass = password.trim();
    const trimmedDogName = dogName.trim();
    const trimmedDogBreed = dogBreed.trim();
    const trimmedDogAge = dogAge.toString().trim();

    if (!trimmedName || !trimmedPass || !trimmedDogName || !trimmedDogBreed || !trimmedDogAge) {
      Alert.alert('Manglende oplysninger', 'Udfyld alle felter.');
      return;
    }

    const ageNumber = parseInt(trimmedDogAge, 10);
    if (isNaN(ageNumber) || ageNumber < 0) {
      Alert.alert('Ugyldig alder', 'Indtast en gyldig alder (heltal).');
      return;
    }

    const newUser = {
      name: trimmedName,
      password: trimmedPass,
      dog: {
        name: trimmedDogName,
        breed: trimmedDogBreed,
        age: ageNumber,
        gender: dogGender,
        image: dogImage || null,
      },
    };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      const existingXP = await AsyncStorage.getItem('xp');
      if (!existingXP) {
        await AsyncStorage.setItem('xp', '0');
      }

      Alert.alert('Bruger oprettet', 'Din konto og hund er gemt 🐶', [
        {
          text: 'OK',
          onPress: () =>
            navigation.replace('MainTabs', {
              screen: 'WalkSelection',
              params: { userName: trimmedName },
            }),
        },
      ]);
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Fejl', 'Kunne ikke gemme brugerdata.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.scroll}                        // 👈 vigtig: grøn baggrund på ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          overScrollMode="never"                       // 👈 Android: fjern hvid overscroll
          bounces={false}                              // 👈 iOS: fjern bounce (kan sættes true hvis du vil beholde effekten)
          contentInsetAdjustmentBehavior="never"       // 👈 undgå auto-insets
        >
          <View style={styles.screen}>
            {/* 🔹 Header */}
            <View style={styles.header}>
              <View style={styles.logoRow}>
                <Text style={styles.logo}>SnudeQuest</Text>
                <Ionicons name="paw" size={34} color="white" style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.subtitle}>OPRET BRUGER</Text>
            </View>

            {/* 🔹 Lys boks */}
            <View style={styles.box}>
              <View style={styles.boxContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Brugernavn"
                  placeholderTextColor="#d6e6d3"
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Adgangskode"
                  placeholderTextColor="#d6e6d3"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="next"
                />

                <Text style={styles.sectionTitle}>Din Hund 🐕</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Navn"
                  placeholderTextColor="#d6e6d3"
                  value={dogName}
                  onChangeText={setDogName}
                  returnKeyType="next"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Race"
                  placeholderTextColor="#d6e6d3"
                  value={dogBreed}
                  onChangeText={setDogBreed}
                  returnKeyType="next"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Alder"
                  placeholderTextColor="#d6e6d3"
                  keyboardType="numeric"
                  value={dogAge}
                  onChangeText={setDogAge}
                  returnKeyType="done"
                />

                {/* Køn dropdown */}
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setGenderModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>{dogGender}</Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color="white"
                    style={{ position: 'absolute', right: 15, top: 12 }}
                  />
                </TouchableOpacity>

                {/* Modal til køn */}
                <Modal
                  visible={genderModalVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setGenderModalVisible(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                      <Text style={styles.modalTitle}>Vælg Køn</Text>

                      <TouchableOpacity
                        style={styles.modalOption}
                        onPress={() => {
                          setDogGender('Han');
                          setGenderModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalText}>Han</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modalOption}
                        onPress={() => {
                          setDogGender('Hun');
                          setGenderModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalText}>Hun</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setGenderModalVisible(false)}
                        style={styles.modalCancel}
                      >
                        <Text style={styles.modalCancelText}>Annullér</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                {dogImage && <Image source={{ uri: dogImage }} style={styles.image} />}

                <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                  <Text style={styles.imageBtnText}>Vælg billede</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
                  <Text style={styles.registerText}>OPRET PROFIL</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Har du allerede en bruger? <Text style={styles.loginLink}>Log ind</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1E5B31',         // 👈 grøn baggrund under safe areas
  },
  scroll: {
    flex: 1,
    backgroundColor: '#1E5B31',         // 👈 vigtig: selve ScrollView’ens baggrund
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#1E5B31',         // 👈 også containeren
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontFamily: 'SigmarOne_400Regular',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  box: {
    width: '90%',
    backgroundColor: '#FAF3E0',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    elevation: 5,
  },
  boxContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1E5B31',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    width: '90%',
    backgroundColor: '#1E5B31',
    color: 'white',
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  registerBtn: {
    backgroundColor: '#1E5B31',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 10,
  },
  registerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginVertical: 15,
  },
  imageBtn: {
    backgroundColor: '#1E5B31',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  imageBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loginText: {
    color: 'white',
    fontSize: 14,
  },
  loginLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E5B31',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
  },
  modalCancel: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#ff4242',
    fontWeight: 'bold',
  },
});
