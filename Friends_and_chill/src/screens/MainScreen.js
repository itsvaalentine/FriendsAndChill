import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { getByCategory, getTrending, getMovieDetails, searchMovies, category, movieType, tvType } from '../services/tmdb';
import { Modal } from 'react-native';

export default function MainScreen({ navigation }) {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    
    const fetchMovies = async (type) => {
        try {
        const response = await getTrending(type);
        if (response.ok) {
            setMovies(response.data.results);
        } else {
            console.error('Error fetching movies:', response.error);
        }
        } catch (error) {
        console.error('Error fetching movies:', error);
        }
    };
    const fetchMovieDetails = async (movieId) => {
        try {
        const response = await getMovieDetails(movieId);
        if (response.ok) {
            setSelectedMovie(response.data);
            setModalVisible(true);
        } else {
            console.error('Error fetching movie details:', response.error);
        }
        } catch (error) {
        console.error('Error fetching movie details:', error);
        }
    };
    const handleSearch = async () => {
        try {
        const response = await searchMovies(searchQuery);
        if (response.ok) {
            setMovies(response.data.results);
        } else {
            console.error('Error searching movies:', response.error);
        }
        } catch (error) {
        console.error('Error searching movies:', error);
        }
    };
    const handleMoviePress = (movieId) => {
        fetchMovieDetails(movieId);
    };
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedMovie(null);
    };
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
            />
            <ScrollView>
                {movies.map((movie) => (
                    <TouchableOpacity key={movie.id} onPress={() => handleMoviePress(movie.id)}>
                        <Image
                            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                            style={styles.moviePoster}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {selectedMovie && (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                        <Image
                            source={{ uri: `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}` }}
                            style={styles.modalImage}
                        />
                        <Text style={styles.modalOverview}>{selectedMovie.overview}</Text>
                        <TouchableOpacity onPress={handleCloseModal}>
                            <Text style={styles.closeButton}>Close</Text>
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
        backgroundColor: '#fff',
        padding: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    moviePoster: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalImage: {
        width: '100%',
        height: 300,
    },
    modalOverview: {
        fontSize: 16,
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    closeButton: {
        fontSize: 18,
        color: '#007BFF',
        marginTop: 20,
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    movieOverview: {
        fontSize: 14,
        color: '#555',
    },
    movieReleaseDate: {
        fontSize: 12,
        color: '#999',
    },
    movieRating: {
        fontSize: 12,
        color: '#999',
    },
    movieGenres: {
        fontSize: 12,
        color: '#999',
    },
    movieLanguage: {
        fontSize: 12,
        color: '#999',
    },
    movieRuntime: {
        fontSize: 12,
        color: '#999',
    },
    movieTagline: {
        fontSize: 12,
        color: '#999',
    },
    movieBudget: {
        fontSize: 12,
        color: '#999',
    },
    movieRevenue: {
        fontSize: 12,
        color: '#999',
    },
    movieProductionCompanies: {
        fontSize: 12,
        color: '#999',
    },
    movieProductionCountries: {
        fontSize: 12,
        color: '#999',
    },
    movieSpokenLanguages: {
        fontSize: 12,
        color: '#999',
    },
});