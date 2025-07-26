import { useFetch, useDeactivate } from '../../../hooks'
import Select from 'react-select'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import Pagination from '../../common/Pagination'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'
import { FetchElementsEndpoint } from '../../../config/apiRoutes'

export default function ListElements ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedItem, setSearchedEdit, permisos }) {
  // Hook para manejar la lista de elementos y su paginación
  const {
    elements,
    setElements,
    allElements,
    filteredElements,
    setFilteredElements,
    page,
    setPage,
    maxPage,
    fetchElements
  } = useFetch({ setAlert, windowHeight, isMaximized, obtener: 'elementos' })

  // Hook para manejar la lógica de desactivación de elementos
  const {
    deactivateElement,
    setDeactivateElement,
    showModal,
    setShowModal,
    handleDeactivate
  } = useDeactivate({ setAlert, obtener: 'elemento', fetchElements })

  // Maneja la activación de la vista para ver detalles de un elemento específico
  const handleView = (codigo, view) => {
    if (view === 'searchElement') setSearchedItem(codigo)// Guarda el código para la vista
    else if (view === 'editElement') setSearchedEdit(codigo)

    setElements([]) // Limpia la lista de elementos para evitar conflictos
    setActiveView(view) // Cambia la vista
  }

  // Maneja la activación del modal para deshabilitar un elemento
  const handleAlert = (codigo, nombre) => {
    setDeactivateElement({ codigo, nombre }) // Configura el elemento a deshabilitar
    setShowModal(true) // Muestra el modal de confirmación
  }

  const opciones = allElements.map(e => ({
    value: e.codigo,
    label: `${e.codigo}: ${e.nombre}`,
    data: e
  }))

  const handleOnChange = (option) => {
    setFilteredElements(option ? allElements.filter(e => e.codigo === option.value) : undefined)
  }

    useEffect(() => {
      const fetchApiEndpoint = FetchElementsEndpoint
      const interval = setInterval(() => {
        fetchElements(fetchApiEndpoint) // Refresca los elementos cada 20 segundos
      }, 20000)
  
      return () => {
        clearInterval(interval) // Limpia el intervalo al desmontar el componente
      }
    }, [])

  return (
    <>
      <span className='title'>
        Listar Elementos
        <div className='search-input'>
          <Select
            options={opciones}
            placeholder='Buscar elemento'
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

      <table className='table table_elementos'>
        <thead className='table__header'>
          <tr className='table__row'>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Area</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className='table__body'>
          {filteredElements && filteredElements.length > 0
            ? (
                filteredElements.map(({ codigo, nombre, area, tipo, estado, cantidad, unidadMedida }, index) => (
                  <tr key={codigo} className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''}`}>
                    <TooltipCell text={codigo} />
                    <TooltipCell text={nombre} />
                    <TooltipCell text={area} />
                    <TooltipCell text={tipo} />
                    <TooltipCell text={estado} />
                    <TooltipCell text={cantidad ? `${cantidad} ${unidadMedida}` : '1 und'} />
                    <td className='table__body--actions'>
                      <div className='tooltip-container'>
                        <Icon icon='system-uicons:eye' width='24' strokeWidth={1.2} onClick={() => handleView(codigo, 'searchElement')} />
                        <span className='tooltip'>Ver</span>
                      </div>
                      {permisos.data.some(p => p.id === 17) && (// 17: Editar elementos
                        <div className='tooltip-container'>
                          <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} onClick={() => handleView(codigo, 'editElement')} />
                          <span className='tooltip'>Editar</span>
                        </div>
                      )}
                      {permisos.data.some(p => p.id === 25) && (// 25: Deshabilitar elementos
                        <div className='tooltip-container'>
                          <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(codigo, nombre)} />
                          <span className='tooltip'>Deshabilitar</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )
            : elements && elements.length > 0
              ? (
                  elements.map(({ codigo, nombre, area, tipo, estado, cantidad, unidadMedida }, index) => (
                    <tr key={codigo} className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''}`}>
                      <TooltipCell text={codigo} />
                      <TooltipCell text={nombre} />
                      <TooltipCell text={area} />
                      <TooltipCell text={tipo} />
                      <TooltipCell text={estado} />
                      <TooltipCell text={cantidad ? `${cantidad} ${unidadMedida}` : '1 und'} />
                      <td className='table__body--actions'>
                        <div className='tooltip-container'>
                          <Icon icon='system-uicons:eye' width='24' strokeWidth={1.2} onClick={() => handleView(codigo, 'searchElement')} />
                          <span className='tooltip'>Ver más detalles</span>
                        </div>
                        {permisos.data.some(p => p.id === 17) && (// 17: Editar elementos
                          <div className='tooltip-container'>
                            <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} onClick={() => handleView(codigo, 'editElement')} />
                            <span className='tooltip'>Editar</span>
                          </div>
                        )}
                        {permisos.data.some(p => p.id === 25) && (// 25: Deshabilitar elementos
                          <div className='tooltip-container'>
                            <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(codigo, nombre)} />
                            <span className='tooltip'>Deshabilitar</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )
              : (
                <tr>
                  <td colSpan={7} className='notFound--message'>No se encontró ningun elemento.</td>
                </tr>
                )}
        </tbody>
      </table>

      <Pagination page={page} setPage={setPage} maxPage={maxPage} />

      <ConfirmModal
        icon={danger}
        title='¿Está seguro que desea deshabilitar este elemento?'
        message={`${deactivateElement.codigo} - ${deactivateElement.nombre}`}
        showModal={showModal}
        setShowModal={setShowModal}
        action={handleDeactivate}
      />
    </>
  )
}
