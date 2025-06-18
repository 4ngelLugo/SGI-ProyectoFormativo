import { useFetchByCode, useFetch } from '../../../hooks'
import Select from 'react-select'
import '../../../styles/globals/lists.css'
import { useEffect, useState } from 'react'

export default function BuscarRol ({ setAlert, searchedItem, setSearchedItem }) {
  const {
    loading,
    typing,
    element,
    setElement,
    setLoading
  } = useFetchByCode({ setAlert, codeToSearch: searchedItem, obtener: 'rol' })

  const {
    elements
  } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'roles' })

  const opciones = elements.map(e => ({
    value: e.id,
    label: `${e.id} - ${e.nombre}`,
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
        Buscar Rol
        <div className='search-input'>
          <Select
            options={opciones}
            placeholder='Buscar rol'
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
