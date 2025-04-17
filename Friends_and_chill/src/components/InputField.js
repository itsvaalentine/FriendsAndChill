import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function InputField({ value, onChangeText, placeholder, secureTextEntry }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 4,
  },
});
