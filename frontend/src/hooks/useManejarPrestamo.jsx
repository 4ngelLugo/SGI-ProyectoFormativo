import { CambiarEstadoPrestamo, ObtenerPrestamosEndpoint } from '../config/apiRoutes'
import { MESSAGES } from '../constants/messages'

export const useManejarPrestamo = ({ setAlert, fetchElements }) => {
  const acciones = {
    entregar: 2, // 2: Entregado
    completar: 5 // 5: Completado
  }

  const message = {
    entregar: 'entregado',
    completar: 'completado'
  }

  const handlePrestamo = async (id, accion) => {
    try {
      const response = await fetch(`${CambiarEstadoPrestamo}${acciones[accion]}`, {
        method: 'POST',
        body: JSON.stringify({ prestamo_id: id }),
        credentials: 'include'
      })

      const data = await response.json()

      if (data.error) {
        setAlert({
          type: 'error',
          message: MESSAGES.prestamo[response.error] || 'Error desconocido',
          active: true
        })
      }

      if (data.success) {
        fetchElements(ObtenerPrestamosEndpoint) // Refresca la lista de prestamos
        setAlert({
          type: 'success',
          message: `Prestamo ${message[accion]} correctamente`,
          active: true
        })
      }
    } catch (error) {
      console.error(error)
      setAlert({
        type: 'error',
        message: 'Ocurrió un error en la petición',
        active: true
      })
    }
  }

  return {
    handlePrestamo
  }
}
