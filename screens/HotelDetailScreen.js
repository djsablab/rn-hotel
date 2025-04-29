import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
export default function HotelDetailScreen({ route, navigation }) {
  const { hotel } = route.params;
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsRef = collection(db, "hotels", hotel.id, "rooms");
        const snapshot = await getDocs(roomsRef);
        const roomList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomList);
      } catch (error) {
        handleMessage({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch rooms.",
        });
      }
    };

    fetchRooms();
  }, []);

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

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomCard}
      activeOpacity={0.75}
      onPress={() => navigation.navigate("Booking", { room: item, hotel })}
    >
      <Text style={styles.roomName}>{item.name}</Text>
      <Text>💵 Price: {item.price}$ / Night</Text>
      <Text>🕺 Capacity: {item.capacity} People</Text>
      <Text>✅ Available: {item.available ? "Yes" : "No"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: hotel.imageUrl }} style={styles.image} />
      <Text style={styles.hotelName}>🏨 {hotel.name}</Text>

      <Text style={styles.desc}>{hotel.description}</Text>
      <View style={styles.hotelLocationContainer}>
        <Ionicons name="location-outline" size={20} color="#000" />
        <Text style={styles.hotelLocation}>{hotel.location}</Text>
      </View>
      <Text style={styles.sectionTitle}>🔑 Rooms</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoom}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 15 },
  hotelName: { fontSize: 24, fontWeight: "bold" },
  location: { color: "#666", marginBottom: 10 },
  desc: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginVertical: 10 },
  roomCard: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 2,
  },
  roomName: { fontSize: 16, fontWeight: "600" },

  hotelLocationContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
