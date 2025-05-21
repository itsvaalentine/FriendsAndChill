import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import PasswordInput from '../components/PasswordInput';
import { login } from '../services/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');

  const validateEmail = (email) => {
    // Simple expresión regular para validar correo
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    setEmailError('');
    setLoginError('');

    if (!validateEmail(email)) {
      setEmailError('Ingresa un correo válido.');
      return;
    }

    try {
      const response = await login(email, password);
      if (response.ok) {
        navigation.replace('HomeScreen');
      } else {
        setLoginError('Email o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('LoginScreen - Login error caught:', error.message);
      setLoginError('Error al iniciar sesión. Intenta más tarde.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.overlayText}>
          <Text style={styles.textStyle}>Friends</Text>
          <Text style={styles.textStyle}>&</Text>
          <Text style={styles.textStyle}>Chill</Text>
        </View>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Contenedor Login */}
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <InputField
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <PasswordInput value={password} onChangeText={setPassword} placeholder="Contraseña" />
          
          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

          <CustomButton
            title="Entrar"
            onPress={handleLogin}
          />
          <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
            <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
          </TouchableOpacity>
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
  registerText: {
    marginTop: 20,
    color: '#6b4c3b',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
  },

  overlayText: {
    position: 'absolute',
    top: '25%',
    left: 10,
    textAlign: 'left',
    zIndex: 2,
  },
  textStyle: {
    left: 10,
    textAlign: 'left',
    color: '#e5caac',
    fontSize: 32,
    fontWeight: 'bold',
    zIndex: 2,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
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
    marginTop: -40,
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
  errorText: {
    color: '#a94442',
    fontSize: 14,
    marginBottom: 10,
    marginTop: -10,
    marginLeft: 5,
  },
});
