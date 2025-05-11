import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { register } from '../services/auth';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerStatus, setRegisterStatus] = useState('');

    const handleRegister = async () => {
    try {
        const { response, data } = await register(username, email, password);
        if (response.ok) {
        setRegisterStatus('success');
        navigation.replace('HomeScreen');
        } else {
        setRegisterStatus('fail');
        }
    } catch (error) {
        console.error('RegisterScreen - Error:', error.message);
        setRegisterStatus('error');
    }
    };

return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <View style={[styles.overlayText, { top: '40%' }]}>
                <Text style={[styles.textStyle, { fontSize: 28 }]}>Regístrate en Friends & Chill</Text>
            </View>
        </View>

        {/* Caja de registro igual a login */}
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Crear cuenta</Text>

                <InputField
                value={username}
                onChangeText={setUsername}
                placeholder="Nombre de usuario"
                />
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

                <CustomButton title="Registrarse" onPress={handleRegister} />

                {registerStatus === 'success' && (
                <Text style={styles.success}>Registro exitoso 🎉</Text>
                )}
                {registerStatus === 'fail' && (
                <Text style={styles.fail}>No se pudo registrar. Revisa los datos.</Text>
                )}
                {registerStatus === 'error' && (
                <Text style={styles.error}>Error al conectar con el servidor.</Text>
                )}
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
    top: '35%',
    left: 10,
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
  success: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
  fail: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    color: 'orange',
    textAlign: 'center',
    marginTop: 10,
  },
});
