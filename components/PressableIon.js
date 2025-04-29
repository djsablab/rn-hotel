import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function PressableIon({ name, size, color, onPress }) {
  return (
    // Combine the Pressable and Ionicons components
    // to create a single component that handles both press events and icon rendering
    // Use the Pressable component to handle press events
    // Use the Ionicons component to render the icon

    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}
