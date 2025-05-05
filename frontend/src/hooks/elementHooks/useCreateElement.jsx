import { useRef, useState } from 'react'
import { SaveElementsEndpoint } from '../../config/apiRoutes'

/**
 * Hook para manejar el estado de maximización de una ventana.
 * Permite alternar entre maximizada y restaurada, ajustando su tamaño y posición.
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 *
 * @returns {Object} - Objeto con la referencia al formulario, el estado del tipo de elemento y la función para manejar el envio del formulario.
 */
export const useCreateElement = (setAlert) => {
  // Referencia al formulario para acceder a los datos
  const formRef = useRef(null)

  // Estado para el tipo de elemento que quiera registrar el usuario
  const [tipo, setTipo] = useState('devolutivo')

  const handleSubmit = (e) => {
    e.preventDefault()

    // Crea un nuevo objeto FormData a partir del formulario
    const formData = new FormData(formRef.current)

    // Realiza la peticion al endpoint de guardar elementos, usando el metodo POST y enviando el objeto FormData
    fetch(SaveElementsEndpoint, {
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
            'campos vacios': 'Por favor llena todos los campos',
            'elemento ya existe': 'Ya existe un elemento con el mismo codigo',
            'error al guardar': 'Ocurrio un error al guardar el elemento'
          }
          setAlert({ type: 'error', message: messages[response.error] || 'Error desconocido', active: true })
        } else if (response.success) {
          setAlert({ type: 'success', message: 'Elemento guardado correctamente', active: true })
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
    tipo,
    setTipo,
    handleSubmit
  }
}
