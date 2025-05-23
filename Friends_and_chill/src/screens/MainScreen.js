import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  Modal, Image, ScrollView, TouchableOpacity
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  searchMovies,
  searchTV,
  getTrending,
  getMovieDetails,
} from '../services/tmdb';

import MovieList from '../components/MovieList'; // Ajusta ruta si es necesario

export default function MainScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movieResults, setMovieResults] = useState([]);
  const [tvResults, setTVResults] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchlistSeries, setWatchlistSeries] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch trending on load
  useEffect(() => {
    const fetchTrending = async () => {
      const movies = await getTrending('movie');
      const tv = await getTrending('tv');
      setTrendingMovies(movies);
      setTrendingTV(tv);
    };
    fetchTrending();
  }, []);

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const movies = await searchMovies(searchQuery);
    const series = await searchTV(searchQuery);

    if (Array.isArray(movies)) {
      const formatted = movies.map(m => ({
        id: m.imdbID,
        title: m.Title,
        poster: m.Poster,
        overview: '',
        mediaType: 'movie',
      }));
      setMovieResults(formatted);
    }

    if (series.ok) {
      const formatted = series.data.results.map(s => ({
        id: s.id.toString(),
        title: s.name,
        poster: s.poster_path
          ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
          : 'https://via.placeholder.com/500x750',
        overview: s.overview,
        mediaType: 'tv',
      }));
      setTVResults(formatted);
    }
  };

  const handleAdd = (item, type) => {
    if (type === 'movie') {
      setWatchlistMovies(prev =>
        prev.find(m => m.id === item.id) ? prev : [...prev, item]
      );
    } else {
      setWatchlistSeries(prev =>
        prev.find(s => s.id === item.id) ? prev : [...prev, item]
      );
    }
  };

  const openModal = async (item, type) => {
    const details = await getMovieDetails(item.id);
    if (!details) return;
    setSelected({
      ...details,
      title: details.Title,
      overview: details.Plot,
      poster: details.Poster,
      platforms: details.WatchProviders?.Streaming || [],
    });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍿 Friend'&Chill</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar películas o series..."
        placeholderTextColor="#6e5844"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      <ScrollView>
        <MovieList title="🔥 Películas populares" data={trendingMovies} type="movie" onAdd={handleAdd} onOpenModal={openModal} />
        <MovieList title="📺 Series populares" data={trendingTV} type="tv" onAdd={handleAdd} onOpenModal={openModal} />
        <MovieList title="➕ Agrega tu lista de películas por ver" data={movieResults} type="movie" onAdd={handleAdd} onOpenModal={openModal} />
        <MovieList title="➕ Agrega tu lista de series por ver" data={tvResults} type="tv" onAdd={handleAdd} onOpenModal={openModal} />
        <MovieList title="🎯 Tu lista de películas" data={watchlistMovies} type="movie" onAdd={handleAdd} onOpenModal={openModal} />
        <MovieList title="🎯 Tu lista de series" data={watchlistSeries} type="tv" onAdd={handleAdd} onOpenModal={openModal} />
      </ScrollView>

      {selected && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selected.title}</Text>
            <Image
              source={{ uri: selected.poster }}
              style={styles.modalImage}
            />
            <ScrollView style={{ padding: 10 }}>
              <Text style={styles.modalOverview}>{selected.overview}</Text>
              <Text style={styles.platformTitle}>Disponible en:</Text>
              {selected.platforms.length > 0 ? (
                selected.platforms.map((p, idx) => (
                  <Text key={idx} style={styles.platformName}>• {p}</Text>
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
    backgroundColor: '#fdf6e3',
    padding: 10,
  },
  header: {
    color: '#4e342e',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#e1c699',
    color: '#4e342e',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fdf6e3',
    padding: 20,
  },
  modalTitle: {
    color: '#4e342e',
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
    color: '#5c4033',
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 10,
  },
  closeButton: {
    color: '#bc8f8f',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  platformTitle: {
    color: '#4e342e',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  platformName: {
    color: '#5c4033',
    fontSize: 14,
  },
});
