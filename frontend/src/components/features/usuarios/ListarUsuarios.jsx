import { useFetch, useDeactivate } from '../../../hooks'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import Pagination from '../../common/Pagination'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'

export default function ListarUsuarios ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedElement }) {
  // Hook para manejar la lista de elementos y su paginación
  const {
    elements,
    setElements,
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
    setSearchedElement(codigo)// Guarda el código para la vista
    setElements([]) // Limpia la lista de usuarios para evitar conflictos
    setActiveView(view) // Cambia la vista
  }

  // Maneja la activación del modal para deshabilitar un usuario
  const handleAlert = (codigo, nombre) => {
    setDeactivateElement({ code: codigo, nombre }) // Configura el usuario a deshabilitar
    setShowModal(true) // Muestra el modal de confirmación
  }

  return (
    <>
      <span className='title'>Listar Usuarios</span>

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
          {elements && elements.length > 0 && elements.map(({ documento, nombres, apellidos, correo, rol, estado }, index) => (
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
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} onClick={() => handleView(documento, 'editarUsuario')} />
                  <span className='tooltip'>Editar</span>
                </div>
                <div className='tooltip-container'>
                  <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(documento, `${nombres} ${apellidos}`)} />
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
