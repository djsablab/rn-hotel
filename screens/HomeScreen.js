import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Animated,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import PressableIon from "../components/PressableIon";
import Toast from "react-native-toast-message";
export default function HomeScreen({ navigation }) {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputAnim = useRef(new Animated.Value(0)).current;

  const handleMessage = ({
    type = "success",
    text1 = "Hello",
    text2 = "This is something 👋",
  }) => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

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
        handleMessage({
          type: "error",
          text: "Error",
          text2: "Failed to fetch hotels!",
        });
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
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PressableIon
            onPress={() => setSearchVisible(!searchVisible)}
            name="search-outline"
            size={28}
            color="#333"
          />
          <PressableIon
            onPress={() => navigation.navigate("Tutorial")}
            name="help-outline"
            size={28}
            color="#333"
          />
        </View>

        <Text style={styles.headerTitle}>RN-Hotel</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* dummy pressableion for spacing */}
          <PressableIon name="person-outline" size={28} color="#00000000" />
          {/* real preessableion */}
          <PressableIon
            onPress={() => navigation.navigate("Profile")}
            name="person-outline"
            size={28}
            color="#333"
          />
        </View>
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
      <Toast />
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
    textAlign: "center",
  },
  hotelCard: {
    borderWidth: 2,
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
    marginBottom: 14,
  },
  image: { width: "100%", height: 200, borderRadius: 6, marginBottom: 10 },

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
