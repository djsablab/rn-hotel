import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  Image,
  Animated,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(inputAnim, {
      toValue: searchVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [searchVisible]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const snapshot = await getDocs(collection(db, "hotels"));
        const hotelList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotels(hotelList);
        setFilteredHotels(hotelList);
      } catch (e) {
        console.log("Failed to fetch hotels:", e);
      }
    };

    fetchHotels();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredHotels(filtered);
  };

  const renderHotel = ({ item }) => (
    <Pressable
      style={styles.hotelCard}
      onPress={() => navigation.navigate("HotelDetail", { hotel: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.hotelName}>{item.name}</Text>
      <Text style={styles.hotelDesc}>{item.description}</Text>
      <View style={styles.hotelLocationContainer}>
        <Ionicons name="location-outline" size={20} color="#000" />
        <Text style={styles.hotelLocation}>{item.location}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => setSearchVisible(!searchVisible)}>
          <Ionicons name="search" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>RN-Hotel</Text>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={28} color="#000" />
        </Pressable>
      </View>

      {searchVisible && (
        <Animated.View
          style={{
            opacity: inputAnim,
            transform: [
              {
                translateY: inputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-40, 0], // slide down
                }),
              },
            ],
          }}
        >
          <TextInput
            style={styles.searchInput}
            placeholder="Type to search hotels"
            value={searchText}
            onChangeText={handleSearch}
          />
        </Animated.View>
      )}

      <FlatList
        data={filteredHotels}
        renderItem={renderHotel}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  hotelCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  hotelName: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: "#333",
    fontWeight: "bold",
  },
  hotelLocation: {
    fontSize: 16,
    color: "#666",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },

  hotelDesc: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: "#666",
  },
  hotelLocationContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
