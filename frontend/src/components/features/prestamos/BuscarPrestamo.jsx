import { useFetchByCode, useFetch } from '../../../hooks'
import Select from 'react-select'
import '../../../styles/globals/lists.css'
import { useEffect, useState } from 'react'

export default function BuscarPrestamo({ setAlert, searchedItem, setSearchedItem }) {
  const {
    loading,
    typing,
    element,
    setElement,
    setLoading
  } = useFetchByCode({ setAlert, codeToSearch: searchedItem, obtener: 'prestamo' })

  const {
    elements
  } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'prestamos' })

  const opciones = elements.map(e => ({
    value: e.prestamo_id,
    label: `${e.prestamo_id}`,
    data: e
  }))
  const [selectedOption, setSelectedOption] = useState(null)

  // Cuando cambia searchElement o elements, actualiza el valor del Select
  useEffect(() => {
    if (searchedItem && elements.length > 0) {
      const found = opciones.find(opt => opt.value === searchedItem)
      setSelectedOption(found || null)
    } else {
      setSelectedOption(null)
    }
  }, [searchedItem, elements])

  const handleOnChange = (option) => {
    if (!option) {
      setSearchedItem('')
      setElement(null)
      setLoading(false)
      setSelectedOption(null)
    } else {
      setSearchedItem(option.value)
      setSelectedOption(option)
    }
  }

  return (
    <>
      <span className='title see-title'>
        Buscar prestamo
        <div className='search-input'>
          <Select
            options={opciones}
            placeholder='Buscar prestamo'
            value={selectedOption}
            onChange={handleOnChange}
            isClearable
            menuPlacement='auto'
            menuPortalTarget={document.body}
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: '12px',
                cursor: state.isDisabled ? 'not-allowed' : 'pointer',
                minWidth: '15em',
                maxWidth: '15em',
                width: '15em'
              }),
              input: (base) => ({
                ...base,
                fontSize: '1rem',
                color: '#84949f'
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: '1rem',
                color: '#84949f'
              }),
              singleValue: (base) => ({
                ...base,
                paddingLeft: '.3em',
                fontSize: '1rem'
              }),
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, zIndex: 9999 })
            }}
          />
        </div>
      </span>

      {loading
        ? (<p>Cargando...</p>)
        : element
          ? (
            <>
              <div className='element-info__container'>
                <p className='element-info__subtitle'>Prestamo</p>
                <Info label='ID prestamo' value={element.prestamo.prestamo_id} />
                <Info label='Usuario' value={element.prestamo.usuario_nombre} />
                <Info label='Estado' value={element.prestamo.estado_prestamo_nombre} />
              </div>

              <div className='element-info__container'>
                <p className='element-info__subtitle'>Solicitante</p>
                <Info label='Documento' value={element.solicitante.solicitante_documento} />
                <Info label='Nombre' value={element.solicitante.solicitante_nombre} />
                <Info label='Correo' value={element.solicitante.solicitante_correo} />
                <Info label='Telefono' value={element.solicitante.solicitante_telefono} />
                <Info label='Direccion' value={element.solicitante.solicitante_direccion} />
              </div>

              <div className='element-info__container'>
                <p className='element-info__subtitle'>Elementos</p>
                <div className="element-info__elements">
                  <p style={{ paddingLeft: '1rem' }} className='element-info__title'>Devolutivos</p>
                  {element.devolutivos && element.devolutivos.map((devo) => (
                    <Info key={devo.elemento_codigo} label='Devolutivo' value={`${devo.elemento_codigo} - ${devo.elemento_nombre}`} />
                  ))}
                </div>
                <div className="element-info__elements">
                  <p style={{ paddingLeft: '1rem' }} className='element-info__title'>Consumibles</p>
                  {element.consumibles && element.consumibles.map((cons) => (
                    <Info key={cons.elemento_codig} label='Consumible' value={`${cons.elemento_codigo} - ${cons.elemento_nombre}`} />
                  ))}
                </div>

              </div>

            </>
          ) : !typing && (<p className='notFound--message'>No se encontró el prestamo.</p>)}
    </>
  )
}

// Componente reutilizable para mostrar información del elemento
function Info({ label, value }) {
  return (
    <div className='element-info'>
      <span className='element-info__title'>{label}</span>
      <span className='element-info__content'>{value}</span>
    </div>
  )
}
