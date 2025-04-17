import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function HotelDetailScreen({ route, navigation }) {
  const { hotel } = route.params;
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsRef = collection(db, 'hotels', hotel.id, 'rooms');
        const snapshot = await getDocs(roomsRef);
        const roomList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomList);
      } catch (error) {
        console.log('Oda verileri alınamadı:', error);
      }
    };

    fetchRooms();
  }, []);

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={() => navigation.navigate('Booking', { room: item, hotel })}
    >
      <Text style={styles.roomName}>{item.name}</Text>
      <Text>Fiyat: {item.price}₺ / gece</Text>
      <Text>Kapasite: {item.capacity} kişi</Text>
      <Text>{item.available ? 'Uygun' : 'Dolu'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: hotel.imageUrl }} style={styles.image} />
      <Text style={styles.hotelName}>{hotel.name}</Text>
      <Text style={styles.location}>{hotel.location}</Text>
      <Text style={styles.desc}>{hotel.description}</Text>

      <Text style={styles.sectionTitle}>Odalar</Text>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={renderRoom}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15 },
  hotelName: { fontSize: 24, fontWeight: 'bold' },
  location: { color: '#666', marginBottom: 10 },
  desc: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginVertical: 10 },
  roomCard: { backgroundColor: '#f2f2f2', padding: 15, borderRadius: 10, marginBottom: 10 },
  roomName: { fontSize: 16, fontWeight: '600' },
});
