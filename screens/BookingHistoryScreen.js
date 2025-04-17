// screens/BookingHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function BookingHistoryScreen() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const bookingsRef = collection(db, 'bookings');
          const q = query(bookingsRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const bookingList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setBookings(bookingList);
        }
      } catch (error) {
        console.log('Rezervasyon verileri alınamadı:', error);
      }
    };

    fetchBookings();
  }, []);

  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.roomName}>{item.hotelName}</Text>
      <Text style={styles.roomDetails}>Oda: {item.roomName}</Text>
      <Text style={styles.roomDetails}>Fiyat: {item.price}₺</Text>
      <Text style={styles.roomDetails}>Tarih: {item.bookedAt.toDate().toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rezervasyon Geçmişi</Text>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={renderBooking}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: '700', color: '#333333', marginBottom: 20, fontFamily: 'Roboto_700Bold' },
  bookingCard: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 15, padding: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 2 },
  roomName: { fontSize: 18, fontWeight: '600', color: '#333333' },
  roomDetails: { fontSize: 14, color: '#666666' },
});
