import { useRef } from 'react'
import { UpdateElementsEndpoint, EditarRolEndpoint, EditarAreaEndpoint, EditarCategoriaEndpoint, EditarMarcaEndpoint, EditarTipoDocumentoEndpoint } from '../../config/apiRoutes'

/**
 * Hook para manejar la edición de un elemento.
 * Soporta tanto el envío desde formularios HTML como desde objetos JS.
 *
 * @param {Function} setAlert - Función para mostrar alertas.
 * @param {string} obtener - Tipo de recurso a editar ('elemento', 'rol').
 * @returns {Object} - Referencia al formulario y funciones para enviar datos.
 */
export const useEdit = ({ setAlert, obtener }) => {
  const endpoints = {
    elemento: UpdateElementsEndpoint,
    rol: EditarRolEndpoint,
    area: EditarAreaEndpoint,
    categoria: EditarCategoriaEndpoint,
    marca: EditarMarcaEndpoint,
    tipoDocumento: EditarTipoDocumentoEndpoint
  }

  const apiEndpoint = endpoints[obtener]
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    sendRequest(formData)
  }

  const submitData = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    return await sendRequest(formData) // Retorna true o false
  }

  const sendRequest = async (formData) => {
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const response = await res.json()

      if (response.error) {
        const messages = {
          'metodo invalido': 'Error en el método de envío',
          'error de conexion a la base de datos': 'Error al conectar con la base de datos',
          'campos vacios': 'Por favor complete todos los campos',
          'no existe': `No se encontró el ${obtener}`,
          'error al actualizar': `Ocurrió un error al editar el ${obtener}`
        }
        setAlert({ type: 'error', message: messages[response.error] || 'Error desconocido', active: true })
        return false
      }

      if (response.success) {
        setAlert({ type: 'success', message: 'Elemento editado correctamente', active: true })
        return true
      }

      // Caso inesperado
      setAlert({ type: 'error', message: 'Respuesta inesperada del servidor', active: true })
      return false
    } catch (error) {
      console.error(error)
      setAlert({ type: 'error', message: 'Ocurrió un error en la petición', active: true })
      return false
    }
  }

  return {
    formRef,
    handleSubmit,
    submitData
  }
}
