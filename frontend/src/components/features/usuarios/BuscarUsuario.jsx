import { useFetchByCode } from '../../../hooks'
import '../../../styles/globals/lists.css'

export default function BuscarUsuario ({ setAlert, searchElement, setSearchedElement }) {
  const {
    loading,
    typing,
    element,
    setElement,
    setLoading
  } = useFetchByCode({ setAlert, codeToSearch: searchElement, obtener: 'usuario' })

  const handleOnChange = (e) => {
    const value = e.target.value
    setSearchedElement(value) // Actualiza el codigo de búsqueda
    if (value.trim() === '') { // Si el input está vacío, limpia el estado del elemento y detiene la carga
      setElement(null)
      setLoading(false)
    }
  }

  return (
    <>
      <span className='title see-title'>
        Buscar usuario
        <div className='search-input'>
          <span>Documento</span>
          <input
            type='text'
            value={searchElement || ''}
            placeholder='Código'
            onChange={handleOnChange}
            className='input'
          />
        </div>
      </span>

      {loading
        ? (<p>Cargando...</p>)
        : element
          ? (
            <div className='element-info__container'>
              <Info label='Documento' value={element.documento} />
              <Info label='Nombre' value={`${element.nombres} ${element.apellidos}`} />
              <Info label='Dirección' value={element.direccion} />
              <Info label='Telefono' value={element.telefono} />
              <Info label='Correo' value={element.correo} />
              <Info label='Rol' value={element.rolNombre} />
              <Info label='Estado' value={element.estado} />
            </div>
            )
          : !typing && (<p>No se encontró el usuario.</p>)}
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
