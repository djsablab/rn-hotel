import React from "react";
import { View, Text,StyleSheet,Image } from "react-native";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import RoundedButton from "../components/RoundedButton";
import Toast from "react-native-toast-message";
export default function BookingScreen({ route, navigation }) {
  const { room, hotel } = route.params;
  const handleMessage = ({
    type = "success",
    text1 = "Hello",
    text2 = "This is something 👋",
  }) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "bottom",
    });
  };
  const handleBooking = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
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
      handleMessage({
        type: "success",
        text1: "Booking Confirmed",
        text2: "Your booking has been confirmed.",
      });
      setTimeout(() => {
        navigation.navigate("Home");
      }, 4000);
    } catch (e) {
      handleMessage({
        type: "error",
        text1: "Error",
        text2: "Failed to confirm booking.",
      });
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
        status={room.available}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
