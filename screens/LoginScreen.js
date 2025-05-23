import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, BackHandler } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import RoundedButton from "../components/RoundedButton";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Toast from "react-native-toast-message";
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (e) {
      setError(e.message);
      handleMessage({
        type: "error",
        text1: "Error",
        text2:
          error === "Firebase: Error (auth/user-not-found)."
            ? "User not found."
            : error || error === "Firebase: Error (auth/wrong-password)."
            ? "Incorrect password."
            : error || error === "Firebase: Error (auth/invalid-email)."
            ? "Invalid email."
            : error || error === "Firebase: Error (auth/too-many-requests)."
            ? "Too many attempts."
            : error || error === "Firebase: Error (auth/user-disabled)."
            ? "This account has been disabled."
            : error || error === "Firebase: Error (auth/weak-password)."
            ? "Password is too weak. It should be at least 6 characters."
            : error || error === "Firebase: Error (auth/missing-password)."
            ? "Please enter a password."
            : error,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RN-Hotel Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <RoundedButton title="Login" onPress={handleLogin} color="#007BFF" />
      <Text onPress={() => navigation.navigate("Register")} style={styles.link}>
        No account? Register now!
      </Text>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 12 },
  link: { color: "blue", marginTop: 10, textAlign: "center" },
});
