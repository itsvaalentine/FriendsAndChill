// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { category, getByCategory, getMovieDetails, getTrending, movieType, tvType } from '../services/tmdb';

// Componente de película con hover
const MovieItem = ({ item, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [details, setDetails] = useState(null);

  // Cargar detalles cuando se hace hover
  const handleHoverIn = async () => {
    setIsHovered(true);
    if (!details) {
      const movieDetails = await getMovieDetails(item.id);
      setDetails(movieDetails);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.item, isHovered && styles.itemHovered]} 
      onPress={onPress}
      onMouseEnter={handleHoverIn}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image 
        source={{ uri: item.poster }} 
        style={styles.poster}
      />
      <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || 'N/A'}</Text>
      
      {isHovered && details && (
        <View style={styles.hoverCard}>
          <Text style={styles.hoverTitle}>{details.Title}</Text>
          <Text style={styles.hoverYear}>{details.Year}</Text>
          <Text style={styles.hoverDescription} numberOfLines={3}>
            {details.Plot}
          </Text>
          {details.Genre && (
            <Text style={styles.hoverGenre}>{details.Genre}</Text>
          )}
          {details.Runtime && (
            <Text style={styles.hoverRuntime}>{details.Runtime}</Text>
          )}
          {details.WatchProviders && details.WatchProviders.Streaming && 
          details.WatchProviders.Streaming.length > 0 && (
            <View>
              <Text style={styles.hoverProvidersTitle}>Streaming en:</Text>
              <Text style={styles.hoverProviders}>
                {details.WatchProviders.Streaming.join(', ')}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Componente de lista horizontal
const MovieListRow = ({ title, data, onViewMore, navigation, category }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity 
        style={styles.viewMoreButton} 
        onPress={onViewMore}
      >
        <Text style={styles.viewMoreText}>Ver más</Text>
      </TouchableOpacity>
    </View>
    
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {data.map(item => (
        <MovieItem 
          key={item.id} 
          item={item} 
          onPress={() => navigation.navigate('Detail', { id: item.id, category })}
        />
      ))}
    </ScrollView>
  </View>
);

// Componente Hero con hover
const HeroSlide = ({ movie, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <TouchableOpacity 
      style={styles.heroContainer} 
      onPress={onPress}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        source={{ uri: movie.backdrop || movie.poster }}
        style={styles.heroBackdrop}
      />
      <View style={[
        styles.heroOverlay, 
        isHovered && styles.heroOverlayHovered
      ]}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{movie.title}</Text>
          <Text style={styles.heroOverview} numberOfLines={isHovered ? 4 : 2}>
            {movie.overview}
          </Text>
          <View style={styles.heroRatingContainer}>
            <Text style={styles.heroRating}>⭐ {movie.rating?.toFixed(1) || 'N/A'}</Text>
          </View>
          
          {isHovered && (
            <TouchableOpacity style={styles.watchButton}>
              <Text style={styles.watchButtonText}>▶ Ver ahora</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const [trendingMovies, setTrendingMovies] = React.useState([]);
  const [popularMovies, setPopularMovies] = React.useState([]);
  const [topRatedMovies, setTopRatedMovies] = React.useState([]);
  const [popularTV, setPopularTV] = React.useState([]);
  const [topRatedTV, setTopRatedTV] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
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
    };
    
    fetchData();
  }, []);

  if (trendingMovies.length === 0) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('LoginScreen');
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Hero Slide */}
      <HeroSlide 
        movie={trendingMovies[0]} 
        onPress={() => navigation.navigate('Detail', { id: trendingMovies[0].id, category: 'movie' })}
      />
      
      {/* Películas Populares */}
      <MovieListRow 
        title="Películas Populares"
        data={popularMovies}
        onViewMore={() => navigation.navigate('ViewAll', { category: category.movie, type: movieType.popular })}
        navigation={navigation}
        category={category.movie}
      />
      
      {/* Películas Mejor Valoradas */}
      <MovieListRow 
        title="Películas Mejor Valoradas"
        data={topRatedMovies}
        onViewMore={() => navigation.navigate('ViewAll', { category: category.movie, type: movieType.top_rated })}
        navigation={navigation}
        category={category.movie}
      />
      
      {/* Series Populares */}
      <MovieListRow 
        title="Series Populares"
        data={popularTV}
        onViewMore={() => navigation.navigate('ViewAll', { category: category.tv, type: tvType.popular })}
        navigation={navigation}
        category={category.tv}
      />
      
      {/* Series Mejor Valoradas */}
      <MovieListRow 
        title="Series Mejor Valoradas"
        data={topRatedTV}
        onViewMore={() => navigation.navigate('ViewAll', { category: category.tv, type: tvType.top_rated })}
        navigation={navigation}
        category={category.tv}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  // Hero styles
  heroContainer: {
    height: 300,
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  heroBackdrop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    transition: 'all 0.3s ease',
  },
  heroOverlayHovered: {
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heroOverview: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 15,
    transition: 'all 0.3s ease',
  },
  heroRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  heroRating: {
    color: '#ffcc00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  watchButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  watchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Section styles
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewMoreButton: {
    borderWidth: 2,
    borderColor: '#ff0000',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 5,
    transition: 'all 0.2s ease',
  },
  viewMoreText: {
    color: '#ff0000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Movie item styles
  item: {
    marginRight: 10,
    width: 120,
    position: 'relative',
    transition: 'all 0.3s ease',
    zIndex: 1,
  },
  itemHovered: {
    transform: [{ translateY: -5 }],
    zIndex: 2,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  itemTitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  rating: {
    color: '#ffcc00',
    fontSize: 12,
    marginTop: 2,
  },
  // Hover card styles
  hoverCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 220,
    backgroundColor: '#1f1f1f',
    padding: 10,
    borderRadius: 8,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  hoverTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hoverYear: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8,
  },
  hoverDescription: {
    color: '#ddd',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  hoverGenre: {
    color: '#bbb',
    fontSize: 11,
    marginBottom: 4,
  },
  hoverRuntime: {
    color: '#bbb',
    fontSize: 11,
    marginBottom: 8,
  },
  hoverProvidersTitle: {
    color: '#aaa',
    fontSize: 11,
    marginBottom: 2,
  },
  hoverProviders: {
    color: '#3a9bdc',
    fontSize: 11,
  },
});