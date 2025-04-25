import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import RoundedButton from '../components/RoundedButton';
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} id = "emails" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <RoundedButton title="Register" onPress={handleRegister} color="#007BFF" />
      {error ? <Text style={styles.error}>{
        error === 'Firebase: Error (auth/email-already-in-use).' ? 'This email is already in use.' : error && error === 'Firebase: Error (auth/invalid-email).' ? 'Type a valid email.' : error && error === 'Firebase: Error (auth/missing-password).' ? 'Password is missing.' : error && error === 'Firebase: Password should be at least 6 characters (auth/weak-password).' ? 'Password must be at least 6 characters.' : error}</Text> : null}
      <Text onPress={() => navigation.navigate('Login')} style={styles.link}>Already have an account? Login now!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 12 },
  error: { color: 'red', marginTop: 10 },
  link: { color: 'blue', marginTop: 20, textAlign: 'center' }
});
