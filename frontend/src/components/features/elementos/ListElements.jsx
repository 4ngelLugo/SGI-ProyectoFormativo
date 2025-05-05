import { useFetchElements, useDeactivateElement } from '../../../hooks'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'

export default function ListElements({ setAlert, setActiveView, setSearchedElement }) {
  // Hook para manejar la lista de elementos
  const {
    elements,
    setElements,
  } = useFetchElements(setAlert)

  // Hook para manejar la lógica de desactivación de elementos
  const {
    deactivateElement,
    setDeactivateElement,
    showModal,
    setShowModal,
    handleDeactivate
  } = useDeactivateElement(setAlert)

  // Maneja la activación de la vista para ver detalles de un elemento específico
  const handleView = (codigo) => {
    setSearchedElement(codigo) // Guarda el código para la vista
    setActiveView('seeElement') // Cambia la vista
    setElements([]) // Limpia la lista de elementos para evitar conflictos
  }

  // Maneja la activación del modal para deshabilitar un elemento
  const handleAlert = (codigo, nombre, tipo) => {
    setDeactivateElement({ code: codigo, name: nombre, type: tipo }) // Configura el elemento a deshabilitar
    setShowModal(true) // Muestra el modal de confirmación
  }

  return (
    <>
      <span className='title'>Listar Elementos</span>

      <table className='table'>
        <thead className='table__header'>
          <tr className='table__row'>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Area</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className='table__body'>
          {elements && elements.map(({ codigo, nombre, area, tipo, estado }, index) => (
            <tr key={index} className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''}`}>

              <TooltipCell text={codigo} />
              <TooltipCell text={nombre} />
              <TooltipCell text={area} />
              <TooltipCell text={tipo} />
              <TooltipCell text={estado} />

              <td className='table__body--actions'>
                {/* Iconos de acciones para cada elemento */}
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:eye' width='24' strokeWidth={1.2} onClick={() => handleView(codigo)} />
                  <span className='tooltip'>Ver</span>
                </div>
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} />
                  <span className='tooltip'>Editar</span>
                </div>
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(codigo, nombre, tipo)} />
                  <span className='tooltip'>Deshabilitar</span>
                </div>
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:settings' width='24' strokeWidth={1.2} />
                  <span className='tooltip'>Mantenimiento</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        icon={danger}
        title='¿Está seguro que desea deshabilitar este elemento?'
        message={`${deactivateElement.code} - ${deactivateElement.name}`}
        showModal={showModal}
        setShowModal={setShowModal}
        action={handleDeactivate}
      />
    </>
  )
}
