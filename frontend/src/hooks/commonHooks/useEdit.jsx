import { useRef } from 'react'
import { UpdateElementsEndpoint, EditarRolEndpoint } from '../../config/apiRoutes'

/**
 * Hook para manejar la edición de un nuevo elemento.
 * Permite gestionar el formulario y el envío de datos al backend.
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 * @returns {Object} - Objeto con la referencia al formulario y la función de envío.
 */
export const useEdit = ({ setAlert, obtener }) => {
  const endpoints = {
    elemento: UpdateElementsEndpoint,
    rol: EditarRolEndpoint
  }

  const apiEndpoint = endpoints[obtener]

  // Referencia al formulario para acceder a los datos
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(formRef.current)

    // Realiza la peticion al endpoint de guardar elementos, usando el metodo POST y enviando el objeto FormData
    fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((response) => {
        // Verifica si la respuesta contiene un error o un mensaje de exito
        if (response.error) {
          const messages = {
            'metodo invalido': 'Error en el metodo de envio',
            'error de conexion a la base de datos': 'Error al conectar con la base de datos',
            'campos vacios': 'Por favor complete todos los campos',
            'no existe': `No se encontró el ${obtener}`,
            'error al actualizar': `Ocurrio un error al editar el ${obtener}`
          }
          setAlert({ type: 'error', message: messages[response.error] || 'Error desconocido', active: true })
        } else if (response.success) {
          setAlert({ type: 'success', message: 'Elemento editado correctamente', active: true })
        }
      })
      // En caso de que ocurra un error en la petición, o un error en el servidor, se captura y se muestra un mensaje de error
      .catch((error) => {
        console.error(error)
        setAlert({ type: 'error', message: 'Ocurrio un error en la petición', active: true })
      })
  }

  return {
    formRef,
    handleSubmit
  }
}
