import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  Alert, Modal, TouchableOpacity, FlatList
} from 'react-native';
import { auth } from '../firebaseConfig';
import { updateProfile, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const displayName = user.displayName || 'Adınız Belirtilmemiş';
      setUserInfo({ name: displayName, email: user.email });
      setNewName(displayName);
      fetchReservations(user.uid);
    }
  }, []);

    const fetchReservations = async () => {
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

          setReservations(bookingList);
        }
      } catch (error) {
        console.log('Rezervasyon verileri alınamadı:', error);
      }
    };
  const handleUpdateProfile = () => {
    const user = auth.currentUser;
    if (user) {
      updateProfile(user, { displayName: newName })
        .then(() => {
          Alert.alert('Başarılı', 'Adınız güncellendi!');
          setUserInfo(prev => ({ ...prev, name: newName }));
          setModalVisible(false);
        })
        .catch((error) => {
          Alert.alert('Hata', 'Ad güncellenemedi.');
          console.log(error);
        });
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((err) => {
        Alert.alert('Hata', 'Çıkış yapılamadı!');
        console.log(err);
      });
  };

  const renderReservation = ({ item }) => (
    <View style={styles.reservationCard}>
      <Text style={styles.reservationTitle}>{item.hotelName}</Text>
      <Text style={styles.reservationDetail}>Oda: {item.roomName}</Text>
      <Text style={styles.reservationDetail}>Tarih: {item.bookedAt.toDate().toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {userInfo && (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>👤 {userInfo.name}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="settings-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
          <Text style={styles.email}>{userInfo.email}</Text>

          <Text style={styles.sectionTitle}>🛏️ Rezervasyonlarınız</Text>
          {reservations.length === 0 ? (
            <Text style={styles.noResText}>Henüz rezervasyon yok.</Text>
          ) : (
            <FlatList
              data={reservations}
              renderItem={renderReservation}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </>
      )}

      {/* Modal Ayarlar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profil Ayarları</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Yeni adınız"
            />
            <Button title="Adı Kaydet" onPress={handleUpdateProfile} color="#2ecc71" />
            <View style={{ marginVertical: 10 }} />
            <Button title="Çıkış Yap" onPress={handleSignOut} color="#e74c3c" />
            <View style={{ marginVertical: 10 }} />
            <Button title="Kapat" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#555', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  noResText: { fontSize: 14, color: '#888' },
  reservationCard: {
    padding: 15, borderWidth: 1, borderColor: '#ddd',
    borderRadius: 10, marginBottom: 10
  },
  reservationTitle: { fontSize: 16, fontWeight: 'bold' },
  reservationDetail: { fontSize: 14, color: '#555' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center'
  },
  modalContent: {
    width: '90%', backgroundColor: '#fff',
    padding: 20, borderRadius: 10
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 15
  }
});
