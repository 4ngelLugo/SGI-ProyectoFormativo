import { useFetch, useDeactivate } from '../../../hooks'
import Select from 'react-select'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import Pagination from '../../common/Pagination'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'

export default function ListarUsuarios ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedItem, setSearchedEdit, permisos }) {
  // Hook para manejar la lista de elementos y su paginación
  const {
    setElements,
    allElements,
    filteredElements,
    setFilteredElements,
    page,
    setPage,
    maxPage,
    fetchElements
  } = useFetch({ setAlert, windowHeight, isMaximized, obtener: 'usuarios' })

  // Hook para manejar la lógica de desactivación de usuarios
  const {
    deactivateElement,
    setDeactivateElement,
    showModal,
    setShowModal,
    handleDeactivate
  } = useDeactivate({ setAlert, obtener: 'usuario', fetchElements })

  // Maneja la activación de la vista para ver detalles de un usuarios específico
  const handleView = (codigo, view) => {
    if (view === 'buscarUsuario') setSearchedItem(codigo)// Guarda el código para la vista
    else if (view === 'editarUsuario') setSearchedEdit(codigo)

    setElements([]) // Limpia la lista de elementos para evitar conflictos
    setActiveView(view) // Cambia la vista
  }

  // Maneja la activación del modal para deshabilitar un usuario
  const handleAlert = (codigo, nombre) => {
    setDeactivateElement({ codigo, nombre }) // Configura el usuario a deshabilitar
    setShowModal(true) // Muestra el modal de confirmación
  }

  const opciones = allElements.map(e => ({
    value: e.documento,
    label: `${e.documento}: ${e.nombres} ${e.apellidos}`,
    data: e
  }))

  const handleOnChange = (option) => {
    setFilteredElements(option ? allElements.filter(e => e.documento === option.value) : undefined)
  }

  return (
    <>
      <span className='title'>
        Listar Usuarios
        <div className='search-input'>
          <Select
            options={opciones}
            placeholder='Buscar usuario'
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
            <th>Documento</th>
            <th>Nombre completo</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className='table__body'>
          {
            filteredElements && filteredElements.length > 0
              ? filteredElements.map(({ documento, nombres, apellidos, correo, rol, estado }, index) => (
                <tr key={index} className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''}`}>

                  <TooltipCell text={documento} />
                  <TooltipCell text={`${nombres} ${apellidos}`} />
                  <TooltipCell text={correo} />
                  <TooltipCell text={rol} />
                  <TooltipCell text={estado} />

                  <td className='table__body--actions'>
                    {/* Iconos de acciones para cada elemento */}
                    <div className='tooltip-container'>
                      <Icon icon='system-uicons:eye' width='24' strokeWidth={1.2} onClick={() => handleView(documento, 'buscarUsuario')} />
                      <span className='tooltip'>Ver</span>
                    </div>
                    {permisos.data.some(p => p.id === 16) && (// 16: Editar usuarios
                      <div className='tooltip-container'>
                        <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} onClick={() => handleView(documento, 'editarUsuario')} />
                        <span className='tooltip'>Editar</span>
                      </div>
                    )}
                    {permisos.data.some(p => p.id === 24) && (// 24: Deshabilitar usuarios
                      <div className='tooltip-container'>
                        <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(documento, `${nombres} ${apellidos}`)} />
                        <span className='tooltip'>Deshabilitar</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
              : allElements && allElements.length > 0 && allElements.map(({ documento, nombres, apellidos, correo, rol, estado }, index) => (
                <tr key={index} className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''}`}>

                  <TooltipCell text={documento} />
                  <TooltipCell text={`${nombres} ${apellidos}`} />
                  <TooltipCell text={correo} />
                  <TooltipCell text={rol} />
                  <TooltipCell text={estado} />

                  <td className='table__body--actions'>
                    {/* Iconos de acciones para cada elemento */}
                    <div className='tooltip-container'>
                      <Icon icon='system-uicons:eye' width='24' strokeWidth={1.2} onClick={() => handleView(documento, 'buscarUsuario')} />
                      <span className='tooltip'>Ver</span>
                    </div>
                    {permisos.data.some(p => p.id === 16) && (// 16: Editar usuarios
                      <div className='tooltip-container'>
                        <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} onClick={() => handleView(documento, 'editarUsuario')} />
                        <span className='tooltip'>Editar</span>
                      </div>
                    )}
                    {permisos.data.some(p => p.id === 24) && (// 24: Deshabilitar usuarios
                      <div className='tooltip-container'>
                        <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(documento, `${nombres} ${apellidos}`)} />
                        <span className='tooltip'>Deshabilitar</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
          }
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
