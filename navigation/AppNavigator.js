// navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HotelDetailScreen from "../screens/HotelDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import BookingScreen from "../screens/BookingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BookingHistoryScreen from "../screens/BookingHistoryScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Başlıkları gizleyebiliriz
          animation: "slide_from_right", // Ekran geçiş animasyonu
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
