import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FindFriendsScreen({ navigation }) {
  const [search, setSearch] = useState('');

  const dogs = [
    { id: 1, name: 'Yorkshire terrier', img: require('../img/hund1.png') },
    { id: 2, name: 'Bulldog', img: require('../img/hund2.png') },
    { id: 3, name: 'Corgi', img: require('../img/hund3.png') },
    { id: 4, name: 'Golden retriever', img: require('../img/hund4.png') },
    { id: 5, name: 'Labrador', img: require('../img/hund5.png') },
    { id: 6, name: 'Chihuahua', img: require('../img/hund6.png') },
    { id: 7, name: 'gravhund', img: require('../img/hund7.png') },
    { id: 8, name: 'malteser', img: require('../img/hund8.png') },
  ];

  const filteredDogs = dogs.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      {/* 🔹 Tilbage-knap */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color="#1E5B31" />
      </TouchableOpacity>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>FIND ANDRE HUNDEVENNER</Text>

        <View style={styles.grid}>
          {filteredDogs.map((dog) => (
            <View key={dog.id} style={styles.dogCard}>
              <Image source={dog.img} style={styles.image} />
              <Text style={styles.dogName}>{dog.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={22} color="white" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Skriv her..."
            placeholderTextColor="#d6e6d3"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF3E0',
  },
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
  container: {
    flex: 1,
    backgroundColor: '#FAF3E0',
  },
  content: {
    alignItems: 'center',
    paddingVertical: 100, // ⬆️ Lidt ekstra margin i toppen
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B3D2A',
    marginBottom: 40, // Mere luft under titlen
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 30, // afstand mellem rækker
    columnGap: 20, // afstand mellem kolonner
    marginHorizontal: 10,
  },
  dogCard: {
    alignItems: 'center',
    width: '22%', // 🔹 4 på række
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 35, // 🔹 gør dem runde
    marginBottom: 8,
  },
  dogName: {
    fontSize: 13,
    color: '#4B3D2A',
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E5B31',
    borderRadius: 25,
    width: '90%',
    height: 45,
    marginTop: 50,
    marginBottom: 40,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
});
