import React from "react";
import { TouchableOpacity, Text } from "react-native";
export default function RoundedButton({ title, onPress, color, style,status = true }) {
  return (
    <TouchableOpacity
      onPress={status ? onPress : null}
      activeOpacity={ status ? 0.75 : 1}
      style={{
        backgroundColor: status ? color : "#ccc" || color,
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        ...style,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
