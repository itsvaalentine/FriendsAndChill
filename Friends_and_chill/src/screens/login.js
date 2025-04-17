import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { login } from '../services/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Logo centrado */}
      <View style={styles.logoContainer}>
        <Text style={styles.overlayText}>Bienvenidooo!!</Text>
        <Image
          source={require('../assets/CAMBIARRRR.jpg')}
          style={styles.logo}
        />
      </View>

      {/* Caja de Login con esquinas redondeadas */}
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <InputField
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <InputField
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            secureTextEntry
          />

          <CustomButton
            title="Entrar"
            onPress={handleLogin}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  overlayText: {
    position: 'absolute',
    top: '35%', // Ajusta si es necesario
    left: 10, // Pegado a la izquierda
    textAlign: 'left',
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    zIndex: 2,
  },  
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },  
  container: {
    flex: 0.75,
    backgroundColor: '#f5f0e1',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    marginTop: -40, // 👈 Esto hace que suba encima del logo
  },
  
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6b4c3b',
    fontWeight: 'bold',
  },
});