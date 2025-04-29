import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import RoundedButton from "../components/RoundedButton";
const { width, height } = Dimensions.get("window");

// This is the tutorial screen for the app
// It provides a brief introduction to the app's features and functionality
// It uses a swiper component to allow users to swipe through different slides
// You just have to replace the images with your own images and texts vice versa.
// You can also add more slides if you want. To do that, just add more objects to the slides array.
const slides = [
  {
    key: "one",
    title: "Welcome to RN-Hotel!",
    text:
      "Discover a seamless hotel booking experience with RN-Hotel, built using React Native.\n\n" +
      "Easily book accommodations, view your booking history, and manage your profile-all in one place.",
    image: require("../assets/tutorials/tutorial-1.png"),
  },
  {
    key: "two",
    title: "Unforgettable Stays With Your Pets",
    text:
      "Our hotels are proudly pet-friendly, therefore your furry companions can join you on every adventure.\n\n" +
      "We welcome you and your pets with open arms!",
    image: require("../assets/tutorials/tutorial-2.png"),
  },
  {
    key: "three",
    title: "Comfort That Feels Like Home",
    text:
      "Enjoy a wide range of amenities designed to make your stay as relaxing and convenient as possible.\n\n" +
      "Everything you need, right at your fingertips.",
    image: require("../assets/tutorials/tutorial-3.png"),
  },
  {
    key: "four",
    title: "Book Your Stay Today",
    text:
      "With just a few taps, you can select your dates, choose your preferred hotel, and confirm your reservation.\n\n" +
      "It’s quick, simple, and hassle-free.",
    image: require("../assets/tutorials/tutorial-4.png"),
  },
];

export default function TutorialScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDone = () => {
    navigation.replace("Home");
  };

  return (
    <Swiper
      loop={false}
      showsButtons={true}
      dotColor="#ccc"
      activeDotColor="#000"
      onIndexChanged={(index) => setCurrentIndex(index)}
    >
      {slides.map((slide, index) => (
        <View key={index} style={styles.slide}>
          <Image
            source={slide.image}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.text}>{slide.text}</Text>

          {/* Show button only on last slide */}
          {index === slides.length - 1 && (
            <RoundedButton title="Done" onPress={handleDone} color="#007BFF" />
          )}
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});
