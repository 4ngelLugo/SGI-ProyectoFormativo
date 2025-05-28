import { useState } from 'react'
import { DeactivateElementsEndPoint } from '../../config/apiRoutes'

/**
 * Hook para manejar la busqueda de un elemento por su codigo
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 *
 * @returns {Object} - Objeto con el estado del elemento a desactivar, el estado de visivilidad del modal y la funcion para desactivar el elemento.
 */
export const useDeactivateElement = ({ setAlert, fetchElements }) => {
  const [deactivateElement, setDeactivateElement] = useState({ codigo: null, nombre: null })
  const [showModal, setShowModal] = useState(false)

  // Función que realiza una petición a la API para deshabilitar un elemento, según su codigo
  const handleDeactivate = () => {
    fetch(DeactivateElementsEndPoint, {
      method: 'POST',
      body: JSON.stringify(deactivateElement),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(response => {
        // Verifica si la respuesta contiene un error o un mensaje de exito
        if (response.error) {
          // Según el error, la alerta muestra un mensaje diferente
          const messages = {
            'campos vacios': 'No se encontro el elemento',
            'elemento no existe': 'El elemento a deshabilitar no existe',
            'error al deshabilitar el elemento': 'Ocurrió un error al deshabilitar el elemento',
            'database connection error': 'Error al conectar con la base de datos'
          }
          setAlert({ type: 'error', message: messages[response.error] || 'Error desconocido', active: true })
        } else if (response.success) {
          // Si la desactivación fue exitosa, se actualiza el estado de los elementos
          fetchElements()
          setAlert({ type: 'success', message: 'Elemento desactivado correctamente', active: true })
        }
      })
      .catch(error => {
        // En caso de que ocurra un error en la petición, o un error en el servidor, se captura y se muestra un mensaje de error
        console.error(error)
        setAlert({ type: 'error', message: 'Ocurrió un error en la petición', active: true })
      })
  }

  return {
    deactivateElement,
    setDeactivateElement,
    showModal,
    setShowModal,
    handleDeactivate
  }
}
