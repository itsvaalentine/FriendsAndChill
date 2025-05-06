import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import { searchMovies, getMovieDetails } from '../services/tmdb';

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('Disney');
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const results = await searchMovies(query);
      setMovies(results);
    };
    fetchData();
  }, [query]);

  // Fetch movie details when hovering
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (hoveredId) {
        const details = await getMovieDetails(hoveredId);
        setHoveredMovie(details);
      }
    };
    
    fetchMovieDetails();
  }, [hoveredId]);

  const renderMovie = ({ item }) => {
    const isHovered = hoveredId === item.imdbID;
    
    return (
      <Pressable
        onHoverIn={() => setHoveredId(item.imdbID)}
        onHoverOut={() => {
          setHoveredId(null);
          setHoveredMovie(null);
        }}
        style={[
          styles.card,
          isHovered && styles.cardHovered
        ]}
      >
        <Image 
          source={{ uri: item.Poster }} 
          style={styles.poster} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.Title}</Text>
          <Text style={styles.year}>{item.Year}</Text>
          
          {isHovered && hoveredMovie && (
            <View style={styles.hoverDetails}>
              {hoveredMovie.Plot && (
                <Text style={styles.description} numberOfLines={3}>
                  {hoveredMovie.Plot}
                </Text>
              )}
              
              {hoveredMovie.Genre && (
                <Text style={styles.genre}>
                  {hoveredMovie.Genre}
                </Text>
              )}
              
              {hoveredMovie.imdbRating && (
                <Text style={styles.rating}>⭐ {hoveredMovie.imdbRating}</Text>
              )}
              
              {hoveredMovie.WatchProviders && hoveredMovie.WatchProviders.Streaming && 
              hoveredMovie.WatchProviders.Streaming.length > 0 && (
                <View style={styles.providersContainer}>
                  <Text style={styles.providersTitle}>Ver en:</Text>
                  <Text style={styles.providers}>
                    {hoveredMovie.WatchProviders.Streaming.join(', ')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Películas</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe el nombre..."
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={renderMovie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#111' 
  },
  title: { 
    fontSize: 24, 
    color: '#fff', 
    marginBottom: 10 
  },
  input: {
    backgroundColor: '#222',
    padding: 10,
    color: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  card: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    transition: 'all 0.3s ease',
  },
  cardHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ translateY: -5 }],
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  poster: { 
    width: 70, 
    height: 100, 
    borderRadius: 5, 
    marginRight: 10 
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  name: { 
    color: '#fff', 
    fontSize: 16, 
    marginBottom: 5,
    fontWeight: 'bold',
  },
  year: {
    color: '#aaa',
    fontSize: 14,
  },
  hoverDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  description: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  genre: {
    color: '#bbb',
    fontSize: 13,
    marginBottom: 5,
  },
  rating: {
    color: '#ffcc00',
    fontSize: 14,
    marginBottom: 5,
  },
  providersContainer: {
    marginTop: 5,
  },
  providersTitle: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 2,
  },
  providers: {
    color: '#3a9bdc',
    fontSize: 13,
  }
});