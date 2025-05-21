import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { getByCategory, getTrending, getMovieDetails, searchMovies, category, movieType, tvType } from '../services/tmdb';

// Componente de Header
const Header = ({ navigation, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.appName}>CineStream</Text>
      </View>
      
      <View style={styles.headerRight}>
        {showSearch ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar películas y series..."
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              autoFocus
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.closeSearchButton} 
              onPress={() => setShowSearch(false)}
            >
              <Text style={styles.closeSearchText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => setShowSearch(true)}
            >
              <Text style={styles.iconText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

// Componente de película con hover
const MovieItem = ({ item, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [details, setDetails] = useState(null);

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

// Componente de lista horizontal sin botón "Ver más"
const MovieListRow = ({ title, data, navigation, category }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
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
  const [searchResults, setSearchResults] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchInitialData();
  }, []);

  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const fetchInitialData = async () => {
  setIsLoading(true);
  try {
    const trending = await getTrending('movie', 'week');
    setTrendingMovies(
      trending.slice(0, 5).map(movie => ({
        ...movie,
        poster: `${imageBaseUrl}${movie.poster_path}`,
        backdrop: `${imageBaseUrl}${movie.backdrop_path}`,
      }))
    );

    const popular = await getByCategory(category.movie, movieType.popular);
    setPopularMovies(
      popular.map(movie => ({
        ...movie,
        poster: `${imageBaseUrl}${movie.poster_path}`,
      }))
    );

    const topRated = await getByCategory(category.movie, movieType.top_rated);
    setTopRatedMovies(
      topRated.map(movie => ({
        ...movie,
        poster: `${imageBaseUrl}${movie.poster_path}`,
      }))
    );

    const popTV = await getByCategory(category.tv, tvType.popular);
    setPopularTV(
      popTV.map(tv => ({
        ...tv,
        poster: `${imageBaseUrl}${tv.poster_path}`,
      }))
    );

    const topTV = await getByCategory(category.tv, tvType.top_rated);
    setTopRatedTV(
      topTV.map(tv => ({
        ...tv,
        poster: `${imageBaseUrl}${tv.poster_path}`,
      }))
    );

    setSearchResults(null);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setIsLoading(false);
  }
};


  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const results = await searchMovies(query);
      setSearchResults(
        results.map(item => ({
          ...item,
          poster: `${imageBaseUrl}${item.poster_path}`,
        }))
      );
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { marginTop: 0 }]}>
      {/* Header with search and login */}
      <Header 
        navigation={navigation} 
        onSearch={handleSearch} 
      />
      
      <ScrollView>
        {searchResults ? (
          // Search results view
          <View style={styles.searchResultsContainer}>
            <View style={styles.searchHeader}>
              <Text style={styles.searchResultsTitle}>Resultados de búsqueda</Text>
              <TouchableOpacity onPress={fetchInitialData}>
                <Text style={styles.clearSearchText}>Volver al inicio</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchResults}>
              {searchResults.length > 0 ? (
                searchResults.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.searchResultItem}
                    onPress={() => navigation.navigate('Detail', { 
                      id: item.id, 
                      category: item.media_type || category.movie 
                    })}
                  >
                    <Image
                      source={{ uri: item.poster }}
                      style={styles.searchItemPoster}
                    />
                    <View style={styles.searchItemInfo}>
                      <Text style={styles.searchItemTitle}>{item.title}</Text>
                      <Text style={styles.searchItemYear}>
                        {item.release_date ? item.release_date.substring(0, 4) : 'N/A'}
                      </Text>
                      <Text style={styles.searchItemRating}>
                        ⭐ {item.rating?.toFixed(1) || 'N/A'}
                      </Text>
                      {item.overview && (
                        <Text style={styles.searchItemOverview} numberOfLines={2}>
                          {item.overview}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>
                  No se encontraron resultados. Intenta con otra búsqueda.
                </Text>
              )}
            </View>
          </View>
        ) : (
          // Home content
          <>
            {/* Hero Slide */}
            {trendingMovies.length > 0 && (
              <HeroSlide 
                movie={trendingMovies[0]} 
                onPress={() => navigation.navigate('Detail', { id: trendingMovies[0].id, category: 'movie' })}
              />
            )}
            
            {/* Películas Populares */}
            <MovieListRow
              title="Películas Populares"
              data={popularMovies}
              navigation={navigation}
              category={category.movie}
            />
            
            {/* Películas Mejor Valoradas */}
            <MovieListRow
              title="Películas Mejor Valoradas"
              data={topRatedMovies}
              navigation={navigation}
              category={category.movie}
            />
            
            {/* Series Populares */}
            <MovieListRow
              title="Series Populares"
              data={popularTV}
              navigation={navigation}
              category={category.tv}
            />
            
            {/* Series Mejor Valoradas */}
            <MovieListRow
              title="Series Mejor Valoradas"
              data={topRatedTV}
              navigation={navigation}
              category={category.tv}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f1df', // color beige claro
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f1df',
  },
  loadingText: {
    color: '#5a4b42', // marrón suave
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#5a4b42', // marrón cálido
    borderBottomWidth: 1,
    borderBottomColor: '#c8ad7f',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  appName: {
    color: '#fce3c3', // color cálido crema
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#c8ad7f', // color más suave que el rojo
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#5a4b42',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#5a4b42',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  item: {
    marginRight: 10,
    width: 120,
    borderRadius: 12,
    backgroundColor: '#fefaf1',
    padding: 6,
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
  heroOverlay: {
    backgroundColor: 'rgba(90, 75, 66, 0.6)', // más cálido que negro
  },
  heroOverlayHovered: {
    backgroundColor: 'rgba(90, 75, 66, 0.8)',
  },
  searchInput: {
    backgroundColor: '#e9dfd1',
    color: '#5a4b42',
  },
  searchButtonText: {
    color: '#5a4b42',
  },
  closeSearchText: {
    color: '#a97449',
  },
  // Ajustes adicionales similares para otros elementos...
});
