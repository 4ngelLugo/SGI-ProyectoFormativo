import { useFetch, useDeactivate } from '../../../hooks'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import Pagination from '../../common/Pagination'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'

export default function ListarRoles ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedItem, setSearchedEdit }) {
  // Hook para manejar la lista de elementos y su paginación
  const {
    elements,
    setElements,
    page,
    setPage,
    maxPage,
    fetchElements
  } = useFetch({ setAlert, windowHeight, isMaximized, obtener: 'roles' })

  // Hook para manejar la lógica de desactivación de elementos
  const {
    deactivateElement,
    setDeactivateElement,
    showModal,
    setShowModal,
    handleDeactivate
  } = useDeactivate({ setAlert, obtener: 'rol', fetchElements })

  const handleView = (codigo, view) => {
    if (view === 'buscarRol') setSearchedItem(codigo)// Guarda el código para la vista
    else if (view === 'editarRol') setSearchedEdit(codigo)

    setElements([]) // Limpia la lista de elementos para evitar conflictos
    setActiveView(view) // Cambia la vista
  }

  const handleAlert = (codigo, nombre) => {
    setDeactivateElement({ code: codigo, nombre }) // Configura el elemento a deshabilitar
    setShowModal(true) // Muestra el modal de confirmación
  }

  return (
    <>
      <span className='title'>Listar Roles</span>

      <table className='table'>
        <thead className='table__header'>
          <tr className='table__row'>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className='table__body'>
          {elements && elements.length > 0 && elements.map(({ id, nombre, estado }, index) => (
            <tr key={index} className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''}`}>

              <TooltipCell text={id} />
              <TooltipCell text={nombre} />
              <TooltipCell text={estado} />

              <td className='table__body--actions'>
                {/* Iconos de acciones para cada elemento */}
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:eye' width='24' strokeWidth={1.2} onClick={() => handleView(id, 'buscarRol')} />
                  <span className='tooltip'>Ver</span>
                </div>
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} onClick={() => handleView(id, 'editarRol')} />
                  <span className='tooltip'>Editar</span>
                </div>
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(id, nombre)} />
                  <span className='tooltip'>Deshabilitar</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} setPage={setPage} maxPage={maxPage} />

      <ConfirmModal
        icon={danger}
        title='¿Está seguro que desea deshabilitar este rol?'
        message={`${deactivateElement.code} - ${deactivateElement.nombre}`}
        showModal={showModal}
        setShowModal={setShowModal}
        action={handleDeactivate}
      />
    </>
  )
}
