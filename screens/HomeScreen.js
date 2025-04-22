import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
export default function HomeScreen({ navigation }) {
  const [hotels, setHotels] = useState([]);
  const [toggle, setToggle] = useState([]);
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const snapshot = await getDocs(collection(db, "hotels"));
        const hotelList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotels(hotelList);
      } catch (e) {
        console.log("Veri çekme hatası:", e);
      }
    };

    fetchHotels();
  }, []);
  const renderHotel = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("HotelDetail", { hotel: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.location}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/icon.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            RN-Hotel
          </Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
        <Pressable onPress={() => navigation.navigate("Profile")}>
            <Image
              source={require("../assets/search.png")}
              style={{ width: 30, height: 30}}
              
            />
          </Pressable>

          <Pressable onPress={() => navigation.navigate("Profile")}>
            <Image
              source={require("../assets/user.png")}
              style={{ width: 30, height: 30 }}
            />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        renderItem={renderHotel}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 25, flex: 1, backgroundColor: "#fff" },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    overflow: "hidden",
  },
  image: { width: "100%", height: 200 },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  desc: { fontSize: 14, paddingHorizontal: 10, paddingBottom: 10 },
  location: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  header: {
    margin: 10,
    padding: 12,
    backgroundColor: "red",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 10,
  },
});
