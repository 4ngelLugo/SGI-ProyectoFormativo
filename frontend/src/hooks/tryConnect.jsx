/* global localStorage */
import { IniciarSesionEndpoint } from '../config/apiRoutes'

/**
 * Función para realizar la autenticación del usuario
 * @param {string} document - Número de documento del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Respuesta de la autenticación
 */
export const tryConnect = async (document, password) => {
  try {
    const requestData = { document, password }

    const response = await fetch(IniciarSesionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(requestData),
      credentials: 'include', // Incluir cookies para la gestión de la sesión
      mode: 'cors'
    })

    // Verifica que la respuesta esté OK (status 2xx)
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()

    // Comprobar si la autenticación fue exitosa
    if (data.status === 'success') {
      // Almacenar el estado de autenticación en localStorage
      localStorage.setItem('isAuthenticated', 'true')
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      return { success: true, message: data.message }
    } else {
      return {
        success: false,
        message: data.message || 'Credenciales inválidas'
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      message: `Error de conexión con el servidor: ${error.message}. Verifique que el servidor esté en funcionamiento.`
    }
  }
}

export default tryConnect
