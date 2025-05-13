import { useRef } from 'react'
import { UpdateElementsEndpoint } from '../../config/apiRoutes'

/**
 * Hook para manejar la edición de un nuevo elemento.
 * Permite gestionar el formulario y el envío de datos al backend.
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 * @returns {Object} - Objeto con la referencia al formulario y la función de envío.
 */
export default function useEditElement(setAlert) {
  // Referencia al formulario para acceder a los datos
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(formRef.current)

    // Realiza la peticion al endpoint de guardar elementos, usando el metodo POST y enviando el objeto FormData
    fetch(UpdateElementsEndpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((response) => {
        // Verifica si la respuesta contiene un error o un mensaje de exito
        if (response.error) {
          const messages = {
            'invalid method': 'Error en el metodo de envio',
            'database connection error': 'Error al conectar con la base de datos',
            'invalid type': 'Tipo de elemento invalido',
            'campos vacios': 'Por favor llene todos los campos',
            'elemento no existe': 'No existe un elemento con ese codigo',
            'error al actualizar': 'Ocurrio un error al editar el elemento'
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
