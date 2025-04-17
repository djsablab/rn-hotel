// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebaseConfig';

export default function ProfileScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        name: user.displayName || 'Adınız Belirtilmemiş',
        email: user.email,
      });
    }
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('Login');  // Giriş ekranına yönlendir
      })
      .catch(error => {
        Alert.alert('Hata', 'Çıkış yapılamadı!');
      });
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Text style={styles.title}>Profil</Text>
          <Text style={styles.bodyText}>Ad: {userInfo.name}</Text>
          <Text style={styles.bodyText}>E-posta: {userInfo.email}</Text>

          <Button title="Çıkış Yap" onPress={handleSignOut} color="#ff6347" />

          <Button 
            title="Rezervasyon Geçmişi" 
            onPress={() => navigation.navigate('BookingHistory')} 
            color="#3498db"  // Mavi buton
          />
        </>
      ) : (
        <Text style={styles.bodyText}>Yükleniyor...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: '700', color: '#333333', marginBottom: 20, fontFamily: 'Roboto_700Bold' },
  bodyText: { fontSize: 16, color: '#333333', fontFamily: 'Roboto_400Regular' },
});
