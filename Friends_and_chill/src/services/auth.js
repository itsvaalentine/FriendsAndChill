export async function login(email, password) {
  try {
    // Aquí harías la petición a tu backend, por ejemplo:
    // const response = await fetch('https://miapi.com/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await response.json();
    // return data;
    
    // Mock de autenticación
    if (email === 'demo@example.com' && password === '123456') {
      return { ok: true, token: 'abc123' };
    } else {
      throw new Error('Usuario/contraseña incorrectos');
    }
  } catch (error) {
    throw error;
  }
}
