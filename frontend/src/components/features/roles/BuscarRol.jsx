import { useFetchByCode } from '../../../hooks'
import '../../../styles/globals/lists.css'

export default function BuscarRol ({ setAlert, searchRole, setSearchRole }) {
  const {
    loading,
    typing,
    element,
    setElement,
    setLoading
  } = useFetchByCode({ setAlert, codeToSearch: searchRole, obtener: 'rol' })

  const handleOnChange = (e) => {
    const value = e.target.value
    setSearchRole(value)
    if (value.trim() === '') {
      setElement(null)
      setLoading(false)
    }
  }

  return (
    <>
      <span className='title see-title'>
        Buscar Rol
        <div className='search-input'>
          <span>Código</span>
          <input
            type='text'
            value={searchRole || ''}
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
              <Info label='ID' value={element.id} />
              <Info label='Nombre' value={element.nombre} />
              <Info label='Permisos'>
                {element?.permisos.map((permiso) => (
                  <p key={permiso.id}>{permiso.nombre}</p>
                ))}
              </Info>

            </div>
            )
          : !typing && (<p>No se encontró el rol.</p>)}
    </>
  )
}

// Componente reutilizable para mostrar información del elemento
function Info ({ label, value, children }) {
  return (
    <div className='element-info'>
      <span className='element-info__title'>{label}</span>
      {value && <span className='element-info__content'>{value}</span>}
      {children && <span className='element-info__content'>{children}</span>}
    </div>
  )
}
