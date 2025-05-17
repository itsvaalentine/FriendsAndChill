import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import CustomButton from '../components/CustomButton';
import Roulette from '../components/Roulette';

export default function ModalScreen() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Abrir Modal" onPress={() => setVisible(true)} color="#007ACC" />
      
      <Modal isVisible={visible} onBackdropPress={() => setVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.text}>Este es un Modal de react-native-modal ⚛️</Text>
          <Roulette />
          <Button title="Cerrar" onPress={() => setVisible(false)} color="#61DAFB" />
        </View>
      </Modal>

      <CustomButton
        title="Ir a NativeModalSceen"
        onPress={() => navigation.navigate('NativeModalSceen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#61DAFB',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    color: '#20232A',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
