import { useFetchByCode } from '../../../hooks'
import '../../../styles/globals/lists.css'

export default function SearchElements ({ setAlert, searchElement, setSearchedElement }) {
  const {
    loading,
    typing,
    element,
    setElement,
    setLoading
  } = useFetchByCode({ setAlert, codeToSearch: searchElement, obtener: 'elemento' })

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
        Buscar elemento
        <div className='search-input'>
          <span>Código</span>
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
        : element && element.tipo === 'devolutivo'
          ? (
            <div className='element-info__container'>
              <Info label='Nombre' value={element.nombre} />
              <Info label='Categoria' value={element.categoriaNombre} />
              <Info label='Área' value={element.areaNombre} />
              <Info label='Tipo' value={element.tipo} />
              <Info label='Placa' value={element.placa} />
              <Info label='Serial' value={element.serial} />
              <Info label='Marca' value={element.marcaNombre} />
              <Info label='Modelo' value={element.modelo} />
              <Info label='Estado' value={element.estado} />
            </div>
            )
          : element && element.tipo === 'consumible'
            ? (
              <div className='element-info__container'>
                <Info label='Nombre' value={element.nombre} />
                <Info label='Categoria' value={element.categoriaNombre} />
                <Info label='Área' value={element.areaNombre} />
                <Info label='Tipo' value={element.tipo} />
                <Info label='Cantidad' value={`${element.cantidad} ${element.unidadMedida}`} />
                <Info label='Estado' value={element.estado} />
              </div>
              )
            : !typing && (<p>No se encontró el elemento.</p>)}
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
