export async function login(email, password) {
  try {
    console.log("Auth.js - Login attempt with:", email, password);
    console.log("Auth.js - Expected credentials:", 'demo@example.com', '123456');
    console.log("Auth.js - Comparison result:", 
                email === 'demo@example.com', 
                password === '123456', 
                email === 'demo@example.com' && password === '123456');
    
    if (email === 'demo@example.com' && password === '123456') {
      console.log("Auth.js - Login successful");
      return { ok: true, token: 'abc123' };
    } else {
      console.log("Auth.js - Login failed");
      throw new Error('Usuario/contraseña incorrectos');
    }
  } catch (error) {
    console.log("Auth.js - Error caught:", error.message);
    throw error;
  }
}

// services/auth.js

export async function register(username, email, password) {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    return response;
  } catch (error) {
    console.error('Error en register:', error.message);
    throw error;
  }
}
