import { useFetch, useDeactivate } from '../../../hooks'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import Pagination from '../../common/Pagination'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'

export default function ListElements ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedElement }) {
  // Hook para manejar la lista de elementos y su paginación
  const {
    elements,
    setElements,
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
    setSearchedElement(codigo)// Guarda el código para la vista
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
      <span className='title'>Listar Elementos</span>

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
          {elements && elements.length > 0 && elements.map(({ codigo, nombre, area, tipo, estado, cantidad, unidadMedida }, index) => (
            <tr key={index} className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''}`}>

              <TooltipCell text={codigo} />
              <TooltipCell text={nombre} />
              <TooltipCell text={area} />
              <TooltipCell text={tipo} />
              <TooltipCell text={estado} />
              <TooltipCell text={cantidad ? `${cantidad} ${unidadMedida}` : '1 und'} />

              <td className='table__body--actions'>
                {/* Iconos de acciones para cada elemento */}
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:eye' width='24' strokeWidth={1.2} onClick={() => handleView(codigo, 'searchElement')} />
                  <span className='tooltip'>Ver</span>
                </div>
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} onClick={() => handleView(codigo, 'editElement')} />
                  <span className='tooltip'>Editar</span>
                </div>
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(codigo, nombre)} />
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
        title='¿Está seguro que desea deshabilitar este elemento?'
        message={`${deactivateElement.code} - ${deactivateElement.nombre}`}
        showModal={showModal}
        setShowModal={setShowModal}
        action={handleDeactivate}
      />
    </>
  )
}
