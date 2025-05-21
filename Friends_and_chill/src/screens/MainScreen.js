import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, TextInput, Modal, Button
} from 'react-native';
import {
  getTrending, getByCategory, getMovieDetails, searchMovies,
  movieType, tvType, category
} from '../services/tmdb';

import { Ionicons } from '@expo/vector-icons';

export default function MainScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movieResults, setMovieResults] = useState([]);
  const [tvResults, setTVResults] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchlistSeries, setWatchlistSeries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = async () => {
    const movies = await searchMovies(searchQuery);
    const series = await searchTV(searchQuery);
    if (movies.ok) setMovieResults(movies.data.results);
    if (series.ok) setTVResults(series.data.results);
  };

  const handleAdd = (item, type) => {
    if (type === 'movie') setWatchlistMovies(prev => [...prev, item]);
    else setWatchlistSeries(prev => [...prev, item]);
  };

  const openModal = async (item, type) => {
    const details = await getMovieDetails(item.id, type);
    const providers = await getWatchProviders(item.id, type);
    if (details.ok && providers.ok) {
      setSelected({ ...details.data, platforms: providers.data.results.MX?.flatrate || [] });
      setModalVisible(true);
    }
  };

  const renderHorizontal = (title, data, type) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map(item => (
          <View key={item.id} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => openModal(item, type)}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
                style={styles.poster}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addIcon}
              onPress={() => handleAdd(item, type)}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.itemTitle}>{item.title || item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎬 Friend'&Chill</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Busca películas o series..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <ScrollView>
        {renderHorizontal('➕ Agrega tu lista de películas por ver', movieResults, 'movie')}
        {renderHorizontal('➕ Agrega tu lista de series por ver', tvResults, 'tv')}
        {renderHorizontal('🎯 Tu lista de películas', watchlistMovies, 'movie')}
        {renderHorizontal('🎯 Tu lista de series', watchlistSeries, 'tv')}
      </ScrollView>

      {selected && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selected.title || selected.name}</Text>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${selected.backdrop_path}` }}
              style={styles.modalImage}
            />
            <ScrollView style={{ padding: 10 }}>
              <Text style={styles.modalOverview}>{selected.overview}</Text>
              <Text style={styles.platformTitle}>Disponible en:</Text>
              {selected.platforms.length > 0 ? (
                selected.platforms.map((p, idx) => (
                  <Text key={idx} style={styles.platformName}>• {p.provider_name}</Text>
                ))
              ) : (
                <Text style={styles.platformName}>No disponible en streaming</Text>
              )}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 10,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#2c2c2e',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  itemContainer: {
    marginRight: 10,
    width: 120,
    alignItems: 'center',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  addIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#000a',
    borderRadius: 12,
    padding: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalOverview: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 10,
  },
  closeButton: {
    color: '#ff5252',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  platformTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  platformName: {
    color: '#ccc',
    fontSize: 14,
  },
});

