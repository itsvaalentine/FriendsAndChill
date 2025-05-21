import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, TextInput, Modal, Button
} from 'react-native';
import {
  getTrending, getByCategory, getMovieDetails, searchMovies,
  movieType, tvType, category
} from '../services/tmdb';

export default function MainScreen() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchlistSeries, setWatchlistSeries] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const [trendingMovies, trendingSeries, topRated] = await Promise.all([
      getTrending(movieType.movie),
      getTrending(tvType.tv),
      getByCategory(movieType.movie, category.top_rated)
    ]);

    if (trendingMovies.ok) setMovies(trendingMovies.data.results);
    if (trendingSeries.ok) setSeries(trendingSeries.data.results);
    if (topRated.ok) setRecommended(topRated.data.results);
  };

  const handleSearch = async () => {
    const result = await searchMovies(searchQuery);
    if (result.ok) setMovies(result.data.results);
  };

  const openModal = async (id) => {
    const result = await getMovieDetails(id);
    if (result.ok) {
      setSelectedMovie(result.data);
      setModalVisible(true);
    }
  };

  const addToWatchlist = (item, type) => {
    if (type === 'movie') {
      setWatchlistMovies(prev => [...prev, item]);
    } else {
      setWatchlistSeries(prev => [...prev, item]);
    }
  };

  const renderHorizontalList = (title, data, type, allowAdd = false) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => openModal(item.id)}
            onLongPress={() => allowAdd && addToWatchlist(item, type)}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
              style={styles.poster}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tu Plataforma, Fodonguilla 💅</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar películas o series..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      <ScrollView>
        {renderHorizontalList('🎬 Crear tu sección de películas por ver', watchlistMovies, 'movie')}
        {renderHorizontalList('📺 Crear tu sección de series por ver', watchlistSeries, 'tv')}
        {renderHorizontalList('✨ Nuestra recomendación para ti', recommended, 'movie', true)}
      </ScrollView>

      {selectedMovie && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedMovie.title || selectedMovie.name}</Text>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}` }}
              style={styles.modalImage}
            />
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalOverview}>{selectedMovie.overview}</Text>
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
    backgroundColor: '#121212',
    padding: 10,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 40,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalScroll: {
    marginBottom: 10,
  },
  modalOverview: {
    color: '#ddd',
    fontSize: 16,
    textAlign: 'justify',
  },
  closeButton: {
    color: '#ff4444',
    fontSize: 18,
    marginTop: 20,
  },
});
