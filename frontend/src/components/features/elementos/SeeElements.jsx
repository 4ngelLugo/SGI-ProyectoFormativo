import { useEffect, useState } from 'react'
import { FetchElementByCodeEndpoint } from '../../../config/apiRoutes'

export default function SeeElements ({ setAlert, searchElement }) {
  // Estado para almacenar los datos del elemento
  // Estado para guardar si la pagina esta guardando está cargando
  // Estado para guardar el código de búsqueda
  // Estado para guardar si el usuario está escribiendo
  const [element, setElement] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchCode, setSearchCode] = useState(searchElement)
  const [typing, setTyping] = useState(false)

  // Función para buscar un elemento por su codigo, haciendo una petición a la API
  const fetchElement = async (code) => {
    try {
      const res = await fetch(`${FetchElementByCodeEndpoint}${code}`)
      const response = await res.json()

      // Si la respuesta tiene error, se muestra una alerta y se limpia el estado del elemento
      if (response.error) {
        setAlert({ type: 'error', message: response.error })
        setElement(null)
      } else {
        setElement(response)
      }
    } catch (error) {
      // Si ocurre un error en la solicitud, se muestra una alerta de error
      setAlert({ type: 'error', message: 'Ocurrio un error en la petición', active: true })
      setElement(null)
      setTyping(false)
    }
  }

  // Efecto para manejar la búsqueda del elemento al escribir en el input
  useEffect(() => {
    // Si el codigo de búsqueda esta vacio, se limpia el estado del elemento y se detiene la carga
    if (!searchCode) {
      setElement(null)
      setLoading(false)
      setTyping(false)
      return
    }

    // Marca que se está escribiendo y comienza a cargar
    setTyping(true)
    setLoading(true)

    // Configura un temporizador de 0.7 segundos para evitar llamadas a la API innecesarias mientras el usuario escribe
    const timer = setTimeout(async () => {
      setTyping(false)
      await fetchElement(searchCode)
      setLoading(false)
    }, 700)

    // Limpia el temporizador si el componente se desmonta o si el código de búsqueda cambia
    return () => clearTimeout(timer)
  }, [searchCode])

  return (
    <>
      <span className='title see-title'>
        Ver elemento
        <div className='search-input'>
          <span>Código</span>
          <input
            type='text'
            value={searchCode || ''}
            placeholder='Código'
            onChange={(e) => {
              const value = e.target.value
              setSearchCode(value) // Actualiza el codigo de búsqueda
              if (value.trim() === '') {
                setElement(null)
                setLoading(false)
              }
            }}
            className='input'
          />
        </div>
      </span>

      {loading
        ? (
          <p>Cargando...</p>
          )
        : element && element.tipo === 'devolutivo'
          ? (
            <div className='element-info__container'>
              <Info label='Nombre' value={element.nombre} />
              <Info label='Placa' value={element.placa} />
              <Info label='Marca' value={element.marca} />
              <Info label='Modelo' value={element.modelo} />
              <Info label='Serial' value={element.serial} />
              <Info label='Área' value={element.area} />
              <Info label='Tipo' value={element.tipo} />
              <Info label='Estado' value={element.estado} />
            </div>
            )
          : element && element.tipo === 'consumible'
            ? (
              <div className='element-info__container'>
                <Info label='Nombre' value={element.nombre} />
                <Info label='Cantidad' value={`${element.cantidad} ${element.medida}`} />
                <Info label='Área' value={element.area} />
                <Info label='Tipo' value={element.tipo} />
                <Info label='Estado' value={element.estado} />
              </div>
              )
            : (
                !typing && <p>No se encontró el elemento.</p>
              )}
    </>
  )
}

// Componente reutilizable para mostrar información del elemento
function Info ({ label, value }) {
  return (
    <div className='element-info'>
      <span className='element-info__title'>{label}</span>
      <span className='element-info__content'>{value}</span>
    </div>
  )
}
