/* global localStorage */
import { useState, useRef } from 'react'
import { IniciarSesionEndpoint } from '../config/apiRoutes'
import { useNavigate } from 'react-router'

/**
 * Función para realizar la autenticación del usuario
 * @param {string} document - Número de documento del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Respuesta de la autenticación
 */
export const tryConnect = () => {
  const formRef = useRef(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const login = async () => {
    try {
      const formData = new FormData(formRef.current)

      const response = await fetch(IniciarSesionEndpoint, {
        method: 'POST',
        body: formData,
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await login()
      if (response.success) {
        navigate('/desktop')
      } else {
        setError(response.message || 'Error de autenticación')
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.')
      console.error(err)
    }
  }

  return { formRef, error, handleSubmit }
}

export default tryConnect
