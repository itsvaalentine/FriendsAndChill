import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { getByCategory, getTrending, getMovieDetails, category, movieType, tvType } from '../services/tmdb';
import { Modal } from 'react-native-paper';



// Componente de Header
const MovieItem = ({ item, onPress }) => {
  const MovieItem = ({ item, onPress }) => {
  if (!item || !item.poster) return null; // Evita crasheo si falta info

  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState(null);

  const handleOpenModal = async () => {
    if (!details) {
      const movieDetails = await getMovieDetails(item.id);
      setDetails(movieDetails);
    }
    setShowModal(true);
  };

  return (
    <>
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <Image source={{ uri: item.poster }} style={styles.poster} />
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || 'N/A'}</Text>

        <TouchableOpacity onPress={handleOpenModal} style={styles.moreButton}>
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{details?.Title || item.title}</Text>
            <Text style={styles.modalText}>{details?.Plot || 'Cargando...'}</Text>
            {details?.Genre && (
              <Text style={styles.modalSubText}>🎬 {details.Genre}</Text>
            )}
            {details?.Runtime && (
              <Text style={styles.modalSubText}>⏱ {details.Runtime}</Text>
            )}
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};


  return (
    <>
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <Image source={{ uri: item.poster }} style={styles.poster} />
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || 'N/A'}</Text>

        <TouchableOpacity onPress={handleOpenModal} style={styles.moreButton}>
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{details?.Title || item.title}</Text>
            <Text style={styles.modalText}>{details?.Plot || 'Cargando...'}</Text>
            {details?.Genre && (
              <Text style={styles.modalSubText}>🎬 {details.Genre}</Text>
            )}
            {details?.Runtime && (
              <Text style={styles.modalSubText}>⏱ {details.Runtime}</Text>
            )}
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MovieItem;

export const fetchInitialData = async (setIsLoading, setTrendingMovies, setPopularMovies, setTopRatedMovies, setPopularTV, setTopRatedTV, setSearchResults) => {
  setIsLoading(true);
  try {
    // Fetch trending for hero
    const trending = await getTrending('movie', 'week');
    setTrendingMovies(trending.slice(0, 5));

    // Fetch section data
    const popular = await getByCategory(category.movie, movieType.popular);
    setPopularMovies(popular);

    const topRated = await getByCategory(category.movie, movieType.top_rated);
    setTopRatedMovies(topRated);

    const popTV = await getByCategory(category.tv, tvType.popular);
    setPopularTV(popTV);

    const topTV = await getByCategory(category.tv, tvType.top_rated);
    setTopRatedTV(topTV);

    setSearchResults(null);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setIsLoading(false);
  }
};

const styles = StyleSheet.create({
  item: {
    marginRight: 10,
    width: 120,
    borderRadius: 12,
    backgroundColor: '#fefaf1',
    padding: 6,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  itemTitle: {
    color: '#5a4b42',
    fontSize: 13,
    marginTop: 5,
  },
  rating: {
    color: '#a97449',
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 10,
  },
  moreText: {
    color: '#a97449',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fef9f0',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5a4b42',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#5a4b42',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 13,
    color: '#8b6f4e',
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#a97449',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
