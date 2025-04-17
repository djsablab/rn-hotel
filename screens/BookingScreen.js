// screens/BookingScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function BookingScreen({ route, navigation }) {
  const { room, hotel } = route.params;

  const handleBooking = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Lütfen giriş yapın");
        return;
      }

      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        hotelId: hotel.id,
        roomId: room.id,
        bookedAt: Timestamp.now(),
        hotelName: hotel.name,
        roomName: room.name,
        price: room.price,
      });

      Alert.alert("Rezervasyon başarıyla yapıldı!");
      navigation.navigate('Home');
    } catch (e) {
      console.log('Rezervasyon hatası:', e);
      Alert.alert("Bir hata oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rezervasyon</Text>
      <Text>Otel: {hotel.name}</Text>
      <Text>Oda: {room.name}</Text>
      <Text>Fiyat: {room.price}₺</Text>
      <Button title="Rezerve Et" onPress={handleBooking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
