import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import RoundedButton from "../components/RoundedButton";
import Toast from "react-native-toast-message";
import { Calendar } from "react-native-calendars";
import { useState } from "react";

export default function BookingScreen({ route, navigation }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const onDayPress = (day) => {
    if (!room.available) {
      return;
    }
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else {
      if (new Date(day.dateString) < new Date(startDate)) {
        setStartDate(day.dateString);
        setEndDate(null);
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  const getMarkedDates = () => {
    if (!startDate) return {};

    const marked = {};
    const start = new Date(startDate);
    marked[startDate] = {
      startingDay: true,
      color: "#007BFF",
      textColor: "white",
    };

    if (endDate) {
      const end = new Date(endDate);

      if (end < start) return marked;

      const current = new Date(start);
      current.setDate(current.getDate() + 1);

      while (current < end) {
        const dateStr = current.toISOString().split("T")[0];
        marked[dateStr] = {
          color: "#a0c4ff",
          textColor: "black",
        };
        current.setDate(current.getDate() + 1);
      }

      marked[endDate] = {
        endingDay: true,
        color: "#007BFF",
        textColor: "white",
      };
    }

    return marked;
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      Toast.show({
        type: "error",
        text1: "Booking Error",
        text2: "Please select both start and end dates!",
        position: "bottom",
      });
      return;
    }

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
        startDate: startDate ? Timestamp.fromDate(new Date(startDate)) : null,
        endDate: endDate ? Timestamp.fromDate(new Date(endDate)) : null,
        hotelName: hotel.name,
        roomName: room.name,
        roomPrice: room.price,
      });

      handleMessage({
        type: "success",
        text1: "Booking Confirmed!",
        text2: `You booked ${room.name} at ${hotel.name}`,
      });
    } catch (error) {
      console.error("Booking error:", error);
      handleMessage({
        type: "error",
        text1: "Booking Failed",
        text2: "Please try again later.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: hotel.imageUrl }} style={styles.image} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>{room.name}</Text>
        <Text style={styles.notAvailable}>
          {" "}
          {room.available ? "" : "Not Available"}
        </Text>
      </View>
      <Text style={styles.price}>${room.price} / night</Text>
      <Text style={styles.label}>Select Booking Range:</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        markingType="period"
        minDate={new Date().toISOString().split("T")[0]}
      />
      <RoundedButton
        title="Confirm Booking"
        onPress={handleBooking}
        color="#007BFF"
        status={room.available && startDate && endDate}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  notAvailable: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    color: "gray",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "500",
  },
  selectedDate: {
    marginTop: 10,
    fontSize: 16,
    color: "green",
  },
});
