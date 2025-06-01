import { useState } from 'react'
import { DeactivateElementsEndPoint, DesactivarRolEndpoint, FetchElementsEndpoint, ObtenerRolesEndpoint } from '../../config/apiRoutes'

/**
 * Hook para manejar la busqueda de un elemento por su codigo
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 *
 * @returns {Object} - Objeto con el estado del elemento a desactivar, el estado de visivilidad del modal y la funcion para desactivar el elemento.
 */
export const useDeactivate = ({ setAlert, obtener, fetchElements }) => {
  const endpoints = {
    elemento: DeactivateElementsEndPoint,
    rol: DesactivarRolEndpoint
  }

  const apiEndpoint = endpoints[obtener]

  const fetchEndpoints = {
    elemento: FetchElementsEndpoint,
    rol: ObtenerRolesEndpoint
  }

  const fetchApiEndpoint = fetchEndpoints[obtener]

  const [deactivateElement, setDeactivateElement] = useState({ codigo: null, nombre: null })
  const [showModal, setShowModal] = useState(false)

  // Función que realiza una petición a la API para deshabilitar un elemento, según su codigo
  const handleDeactivate = () => {
    fetch(apiEndpoint, {
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
            'metodo invalido': 'Error en el metodo de envio',
            'campos vacios': `No se encontró el ${obtener}`,
            'no existe': `El ${obtener} a desactivar no existe`,
            'error al desactivar': `Ocurrió un error al desactivar el ${obtener}`,
            'error de conexion a la base de datos': 'Error al conectar con la base de datos'
          }
          setAlert({ type: 'error', message: messages[response.error] || 'Error desconocido', active: true })
        } else if (response.success) {
          // Si la desactivación fue exitosa, se actualiza el estado de los elementos
          fetchElements(fetchApiEndpoint)
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
