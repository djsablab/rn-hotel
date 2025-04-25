import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { auth } from "../firebaseConfig";
import { updateProfile, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import RoundedButton from "../components/RoundedButton";

export default function ProfileScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const displayName = user.displayName || "User";
      setUserInfo({ name: displayName, email: user.email });
      setNewName(displayName);
      fetchReservations(user.uid);
    }
  }, []);

  const fetchReservations = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const bookingList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReservations(bookingList);
      }
    } catch (error) {
      console.log("Could not fetch bookings:", error);
    }
  };
  const handleUpdateProfile = () => {
    const user = auth.currentUser;
    if (user) {
      updateProfile(user, { displayName: newName })
        .then(() => {
          Alert.alert("Information", "You name has been updated.");
          setUserInfo((prev) => ({ ...prev, name: newName }));
          setModalVisible(false);
        })
        .catch((error) => {
          Alert.alert("Error!", "Name could not be updated.");
          console.log(error);
        });
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((err) => {
        Alert.alert("Error!", "Could not sign out.");
        console.log(err);
      });
  };

  const renderReservation = ({ item }) => (
    <View style={styles.reservationCard}>
      <Text style={styles.reservationTitle}>{item.hotelName}</Text>
      <Text style={styles.reservationDetail}>Room: {item.roomName}</Text>
      <Text style={styles.reservationDetail}>
        Date: {item.bookedAt.toDate().toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {userInfo && (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Hi {userInfo.name}!</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="settings-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
          <Text style={styles.email}>{userInfo.email}</Text>

          <Text style={styles.sectionTitle}>🛏️ Your Bookings</Text>
          {reservations.length === 0 ? (
            <Text style={styles.noResText}>No bookings found.</Text>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true} // For Android
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚙️ Profile Settings</Text>
            <Text style={styles.modalMessage}>Current Name: </Text>
            <View
              style={{
                gap: 10,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Type your new name"
              />
              <RoundedButton
                title="Update"
                onPress={handleUpdateProfile}
                color="#007BFF"
                style={{ width: "35%" }}
              />
            </View>
            <RoundedButton
              title="Sign Out"
              onPress={handleSignOut}
              color="#FF0000"
            />
            <RoundedButton
              title="Close"
              color="#333"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  email: { fontSize: 16, color: "#555", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  noResText: { fontSize: 14, color: "#888" },
  reservationCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  reservationTitle: { fontSize: 16, fontWeight: "bold" },
  reservationDetail: { fontSize: 14, color: "#555" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "65%",
  },
  modalMessage: { fontSize: 14, color: "#555" },
});
