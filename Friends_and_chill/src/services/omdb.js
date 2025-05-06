import axios from 'axios';

const API_KEY = 'TU_API_KEY_AQUI'; // ← reemplaza con tu clave
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        s: query,       // 'Batman', 'Avengers', etc.
        apikey: API_KEY,
      },
    });

    return response.data.Search || []; // Devuelve array o vacío
  } catch (error) {
    console.error('Error al buscar películas:', error);
    return [];
  }
};
export const getMovieDetails = async (id) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        i: id,         // 'tt1234567', etc.
        apikey: API_KEY,
      },
    });

    return response.data; // Devuelve detalles de la película
  } catch (error) {
    console.error('Error al obtener detalles de la película:', error);
    return null;
  }
};