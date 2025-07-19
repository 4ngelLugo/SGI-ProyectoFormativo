/* global localStorage */
import { useState, useRef } from 'react'
import { IniciarSesionEndpoint } from '../config/apiRoutes'
import { useNavigate } from 'react-router'
import { MESSAGES } from '../constants/messages'

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

      const res = await fetch(IniciarSesionEndpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const response = await res.json()

      // Comprobar si la autenticación fue exitosa
      if (response.success) {
        // Almacenar el estado de autenticación en localStorage
        localStorage.setItem('isAuthenticated', 'true')
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return { success: true, mensaje: response.mensaje }
      } else {
        return {
          success: false,
          message: MESSAGES.login[response.error] || 'Credenciales inválidas'
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      return {
        success: false,
        message: 'Ocurrió un error en la petición'
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await login()

    if (res.success) {
      setError(null)
      navigate('/desktop')
    } else {
      setError(res.message || 'Error de autenticación')
    }
  }

  return { formRef, error, handleSubmit }
}

export default tryConnect
