// screens/BookingScreen.js
import React from "react";
import { View, Text, Button, StyleSheet, Alert, Image } from "react-native";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import RoundedButton from "../components/RoundedButton";
export default function BookingScreen({ route, navigation }) {
  const { room, hotel } = route.params;

  const handleBooking = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Please log in to app.");
        navigation.navigate("Login");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        hotelId: hotel.id,
        roomId: room.id,
        bookedAt: Timestamp.now(),
        hotelName: hotel.name,
        roomName: room.name,
        price: room.price,
      });

      Alert.alert("Information", "Booking was successful!");
      navigation.navigate("Home");
    } catch (e) {
      console.log("Error:", "An unexocpected error occured:", e);
      Alert.alert("Error", "An unexpected error occured.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Booking for: {room.name}</Text>
        <Image
          source={{ uri: hotel.imageUrl }}
          style={{ width: "100%", height: 200, marginBottom: 10 }}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Booking Details
        </Text>
        <Text style={{ fontSize: 14, marginBottom: 10 }}>
          Please confirm your booking details:
        </Text>
        <Text>🏨 Hotel: {hotel.name}</Text>
        <Text>🔑 Room: {room.name}</Text>
        <Text>💵 Price: {room.price}$</Text>
        <Text>🕺 Capacity: {room.capacity} People</Text>
        <Text>✅ Available: {room.available ? "Yes" : "No"}</Text>
      </View>
      <RoundedButton
        title="Confirm Booking"
        onPress={handleBooking}
        color="#007BFF"
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
