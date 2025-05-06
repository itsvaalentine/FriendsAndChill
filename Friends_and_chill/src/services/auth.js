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