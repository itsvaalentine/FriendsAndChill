// src/services/authService.js
import { API_URL } from '@env';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return { response, data };
  } catch (error) {
    throw new Error('Error de red al intentar iniciar sesión');
  }
};

export const register = async ( username, email, password) => {
  try {
    console.log(`${API_URL}/api/users/register`);
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    return { response, data };
  } catch (error) {
    throw new Error('Error de red al intentar iniciar sesión');
  }
};