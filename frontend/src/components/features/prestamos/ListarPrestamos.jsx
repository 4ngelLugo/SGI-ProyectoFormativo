import { useFetch, useDeactivate } from '../../../hooks'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import Pagination from '../../common/Pagination'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'

export default function ListarPrestamos ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedItem, setSearchedEdit }) {
  // Hook para manejar la lista de elementos y su paginación
  const {
    elements,
    setElements,
    page,
    setPage,
    maxPage,
    fetchElements
  } = useFetch({ setAlert, windowHeight, isMaximized, obtener: 'prestamos' })

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
    if (view === 'buscarPrestamo') setSearchedItem(codigo)// Guarda el código para la vista
    else if (view === 'editarPrestamo') setSearchedEdit(codigo)

    setElements([]) // Limpia la lista de elementos para evitar conflictos
    setActiveView(view) // Cambia la vista
  }

  // Maneja la activación del modal para deshabilitar un elemento
  const handleAlert = (codigo, nombre) => {
    setDeactivateElement({ code: codigo, nombre }) // Configura el elemento a deshabilitar
    setShowModal(true) // Muestra el modal de confirmación
  }

  return (
    <>
      <span className='title'>Listar Prestamos</span>

      <table className='table table_prestamos'>
        <thead className='table__header'>
          <tr className='table__row'>
            <th>ID</th>
            <th>Usuario</th>
            <th>Solicitante</th>
            <th>Fecha Solicitud</th>
            <th>Fecha Entrega</th>
            <th>Fecha Devolución</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className='table__body'>
          {elements && elements.length > 0 && elements.map(({ prestamo_id, usuario_nombre, solicitante_nombre, prestamo_fecha_solicitud, prestamo_fecha_entrega, prestamo_fecha_devolucion, estado_prestamo_nombre }, index) => (
            <tr key={index} className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''}`}>

              <TooltipCell text={prestamo_id} />
              <TooltipCell text={usuario_nombre} />
              <TooltipCell text={solicitante_nombre} />
              <TooltipCell text={prestamo_fecha_solicitud} />
              <TooltipCell text={prestamo_fecha_entrega} />
              <TooltipCell text={prestamo_fecha_devolucion} />
              <TooltipCell text={estado_prestamo_nombre} />

              <td className='table__body--actions'>
                {/* Iconos de acciones para cada elemento */}
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:eye' width='24' strokeWidth={1.2} onClick={() => handleView(prestamo_id, 'buscarPrestamo')} />
                  <span className='tooltip'>Ver</span>
                </div>
                {/* <div className='tooltip-container'>
                  <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} onClick={() => handleView(prestamo_id, 'editElement')} />
                  <span className='tooltip'>Editar</span>
                </div>
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(prestamo_id, nombre)} />
                  <span className='tooltip'>Deshabilitar</span>
                </div> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} setPage={setPage} maxPage={maxPage} />

      <ConfirmModal
        icon={danger}
        title='¿Está seguro que desea deshabilitar este elemento?'
        message={`${deactivateElement.code} - ${deactivateElement.nombre}`}
        showModal={showModal}
        setShowModal={setShowModal}
        action={handleDeactivate}
      />
    </>
  )
}
