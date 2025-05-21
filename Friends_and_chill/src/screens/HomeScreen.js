import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { getByCategory, getTrending, getMovieDetails, searchMovies, category, movieType, tvType } from '../services/tmdb';
import { Modal } from 'react-native';


// Componente de Header
const Header = ({ navigation, onSearch, setShowLoginModal  }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  


  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery); // <-- ¡ya no setShowLoginModal aquí!
    }
  };






  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.appName}>Friend'&Chill</Text>
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
              onPress={handleSearch}
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
              onPress={() => navigation.navigate('LoginScreen')}
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
      onPress={onPress}
      onLongPress={handleHoverIn}
      
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
  const [showLoginModal, setShowLoginModal] = React.useState(false);


  React.useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
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

  const handleSearch = async (query) => {

    if (!query || query.trim().length === 0) return;

    setShowLoginModal(true);
    // setIsLoading(true);
    // try {
    //   const results = await searchMovies(query);
    //   setSearchResults(results);
    // } catch (error) {
    //   console.error('Error searching:', error);
    // } finally {
    //   setIsLoading(false);
    // }
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
        setShowLoginModal={setShowLoginModal}
      />
      <Modal
        visible={showLoginModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Inicia esta aventura iniciando sesión</Text>
            <Text style={styles.modalText}>
              Para encontrar tu selección personalizada de películas
            </Text>

            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => {
                setShowLoginModal(false);
                navigation.navigate('LoginScreen');
              }}
            >
              <Text style={styles.modalButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => setShowLoginModal(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  backgroundColor: '#1E1A17',
},
loadingText: {
  color: '#F5EBDD',
  fontSize: 18,
},
appName: {
  color: '#8B4C39',
  fontSize: 22,
  fontWeight: 'bold',
},
header: {
  backgroundColor: '#3B3632',
  borderBottomColor: '#605B57',
},
loginButton: {
  backgroundColor: '#8B4C39',
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 20,
},
loginButtonText: {
  color: '#F5EBDD',
  fontWeight: 'bold',
},
searchInput: {
  backgroundColor: '#605B57',
  color: '#F5EBDD',
},
searchButtonText: {
  color: '#F5EBDD',
},
closeSearchText: {
  color: '#C7B9A5',
},
searchItemTitle: {
  color: '#F5EBDD',
},
searchItemYear: {
  color: '#C7B9A5',
},
searchItemRating: {
  color: '#E8C26A',
},
searchItemOverview: {
  color: '#C7B9A5',
},
sectionTitle: {
  color: '#F5EBDD',
},
itemTitle: {
  color: '#F5EBDD',
},
rating: {
  color: '#E8C26A',
},
heroTitle: {
  color: '#F5EBDD',
},
heroOverview: {
  color: '#C7B9A5',
},
heroOverlay: {
  backgroundColor: 'rgba(30, 26, 23, 0.8)',
},
modalContent: {
  backgroundColor: '#3B3632',
},
modalTitle: {
  color: '#F5EBDD',
},
modalText: {
  color: '#C7B9A5',
},
modalButtonPrimary: {
  backgroundColor: '#8B4C39',
},
modalButtonText: {
  color: '#F5EBDD',
},
modalButtonTextSecondary: {
  color: '#C7B9A5',
},
modalButtonSecondary: {
  backgroundColor: '#3B3632',
},

});