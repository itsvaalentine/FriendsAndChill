import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput } from 'react-native';
import { searchMovies } from '../services/omdb';

export default function HomeScreen() {
const [movies, setMovies] = useState([]);
const [query, setQuery] = useState('Batman');

useEffect(() => {
const fetchData = async () => {
const results = await searchMovies(query);
setMovies(results);
};
fetchData();
}, [query]);

return ( <View style={styles.container}> <Text style={styles.title}>Buscar Películas</Text> <TextInput
     style={styles.input}
     placeholder="Escribe el nombre..."
     placeholderTextColor="#999"
     value={query}
     onChangeText={setQuery}
   />
\<FlatList
data={movies}
keyExtractor={(item) => item.imdbID}
renderItem={({ item }) => ( <View style={styles.card}>
\<Image source={{ uri: item.Poster }} style={styles.poster} /> <Text style={styles.name}>{item.Title}</Text> </View>
)}
/> </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 10, backgroundColor: '#111' },
title: { fontSize: 24, color: '#fff', marginBottom: 10 },
input: {
backgroundColor: '#222',
padding: 10,
color: '#fff',
borderRadius: 8,
marginBottom: 20,
},
card: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
poster: { width: 70, height: 100, borderRadius: 5, marginRight: 10 },
name: { color: '#fff', fontSize: 16, flexShrink: 1 },
});
