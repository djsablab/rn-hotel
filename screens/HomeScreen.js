import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'hotels'));
        const hotelList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHotels(hotelList);
      } catch (e) {
        console.log("Veri çekme hatası:", e);
      }
    };
  
    fetchHotels();
  }, []);
  const renderHotel = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelDetail', { hotel: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.location}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <Button title="Profil" onPress={() => navigation.navigate('Profile')}></Button>
      <FlatList
        data={hotels}
        keyExtractor={item => item.id}
        renderItem={renderHotel}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { marginBottom: 15, borderRadius: 10, backgroundColor: '#f1f1f1', overflow: 'hidden' },
  image: { width: '100%', height: 200 },
  name: { fontSize: 18, fontWeight: 'bold', padding: 10 },
  location: { fontSize: 14, color: '#666', paddingHorizontal: 10, paddingBottom: 10 }
});
