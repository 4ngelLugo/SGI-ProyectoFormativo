import { useState } from 'react'
import { useFetchElementByCode } from '../../../hooks'
import '../../../styles/globals/lists.css'

export default function SeeElements ({ setAlert, searchElement, setSearchedElement }) {
  const [inputCode, setInputCode] = useState(searchElement || '')

  const {
    loading,
    typing,
    element,
    setElement,
    setLoading
  } = useFetchElementByCode({ setAlert, codeToSearch: inputCode })

  const handleOnChange = (e) => {
    const value = e.target.value
    setSearchedElement(value)
    setInputCode(value) // Actualiza el codigo de búsqueda
    if (value.trim() === '') {
      setElement(null)
      setLoading(false)
    }
  }

  return (
    <>
      <span className='title see-title'>
        Ver elemento
        <div className='search-input'>
          <span>Código</span>
          <input
            type='text'
            value={inputCode}
            placeholder='Código'
            onChange={(e) => handleOnChange(e)}
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
              <Info label='Placa' value={element.placa} />
              <Info label='Marca' value={element.marca} />
              <Info label='Modelo' value={element.modelo} />
              <Info label='Serial' value={element.serial} />
              <Info label='Área' value={element.area} />
              <Info label='Tipo' value={element.tipo} />
              <Info label='Estado' value={element.estado} />
            </div>
            )
          : element && element.tipo === 'consumible' && (
            <div className='element-info__container'>
              <Info label='Nombre' value={element.nombre} />
              <Info label='Cantidad' value={`${element.cantidad} ${element.medida}`} />
              <Info label='Área' value={element.area} />
              <Info label='Tipo' value={element.tipo} />
              <Info label='Estado' value={element.estado} />
            </div>
          )}
      {!typing && !element && <p>No se encontró el elemento.</p>}
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
