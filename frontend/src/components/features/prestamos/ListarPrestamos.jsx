/* global localStorage */
import { useFetch, useDeactivate, useManejarPrestamo } from '../../../hooks'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import Pagination from '../../common/Pagination'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'
import { useEffect } from 'react'
import { ObtenerPrestamosEndpoint } from '../../../config/apiRoutes'

export default function ListarPrestamos ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedItem, setSearchedEdit, permisos }) {
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
  } = useDeactivate({ setAlert, obtener: 'prestamo', fetchElements })

  const { handlePrestamo } = useManejarPrestamo({ setAlert, fetchElements })

  const userString = localStorage.getItem('user')
  const usuario = userString ? JSON.parse(userString) : null

  // Maneja la activación de la vista para ver detalles de un elemento específico
  const handleView = (codigo, view) => {
    if (view === 'buscarPrestamo') setSearchedItem(codigo)// Guarda el código para la vista
    else if (view === 'editarPrestamo') setSearchedEdit(codigo)

    setElements([]) // Limpia la lista de elementos para evitar conflictos
    setActiveView(view) // Cambia la vista
  }

  // Maneja la activación del modal para deshabilitar un elemento
  const handleAlert = (codigo, usuario, solicitante) => {
    setDeactivateElement({
      codigo,
      nombre: null,
      usuario,
      solicitante
    }) // Configura el elemento a deshabilitar
    setShowModal(true) // Muestra el modal de confirmación
  }

  const formatFecha = (fechaISO) => {
    const [year, month, day] = fechaISO.split('-') // divide por guiones
    const fecha = new Date(year, month - 1, day) // month empieza en 0

    const dia = fecha.getDate()
    const mes = new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(fecha)
    const anio = fecha.getFullYear()

    return `${dia}, ${mes} de ${anio}`
  }

  useEffect(() => {
    const fetchApiEndpoint = ObtenerPrestamosEndpoint
    const interval = setInterval(() => {
      fetchElements(fetchApiEndpoint) // Refresca los prestamos cada 20 segundos
    }, 20000)

    return () => {
      clearInterval(interval) // Limpia el intervalo al desmontar el componente
    }
  }, [])

  return (
    <>
      <span className='title'>Listar Prestamos</span>

      <table className='table table_prestamos'>
        <thead className='table__header'>
          <tr className='table__row'>
            <th>ID</th>
            <th>Prestamista</th>
            <th>Solicitante</th>
            <th>Fecha Solicitud</th>
            <th>Fecha Entrega</th>
            <th>Fecha Devolución</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className='table__body'>
          {
            elements && elements.length > 0
              ? elements.map(({ id, usuarioNombre, usuarioApellido, solicitanteNombre, prestamoFechaSolicitud, prestamoFechaEntrega, prestamoFechaDevolucion, estado, estadoId }, index) => (
                <tr
                  key={index}
                  className={
                    `table__row
                ${index % 2 === 1 ? 'table__row--alt' : ''}
                ${estadoId === 4 ? 'cancelado' : ''}
                ${estadoId === 3 ? 'atrasado' : ''}
              `
                  }
                >

                  <TooltipCell text={id} />
                  <TooltipCell text={`${usuarioNombre} ${usuarioApellido}`} />
                  <TooltipCell text={solicitanteNombre} />
                  <TooltipCell text={formatFecha(prestamoFechaSolicitud)} />
                  <TooltipCell text={formatFecha(prestamoFechaEntrega)} />
                  <TooltipCell text={formatFecha(prestamoFechaDevolucion)} />
                  <TooltipCell text={estado} />

                  <td className='table__body--actions'>
                    {/* Iconos de acciones para cada elemento */}
                    <div className='tooltip-container'>
                      <Icon icon='system-uicons:eye' width='24' strokeWidth={1.2} onClick={() => handleView(id, 'buscarPrestamo')} />
                      <span className='tooltip'>Ver más detalles</span>
                    </div>
                    {usuario?.nombre === `${usuarioNombre} ${usuarioApellido}` && (
                      <>
                        <div className='tooltip-container'>
                          <Icon icon='system-uicons:create' width='24' strokeWidth={1.2} onClick={() => handleView(id, 'editarPrestamo')} />
                          <span className='tooltip'>Editar</span>
                        </div>

                        {estadoId !== 4 && estadoId !== 5 && (
                          <div className='tooltip-container'>
                            <Icon icon='system-uicons:cross-circle' width='24' strokeWidth={1.2} onClick={() => handleAlert(id, usuarioNombre, solicitanteNombre)} />
                            <span className='tooltip'>Cancelar</span>
                          </div>
                        )}
                        {estadoId === 1 && (
                          <div className='tooltip-container'>
                            <Icon
                              icon='system-uicons:inbox-alt'
                              width='24'
                              strokeWidth={1.2}
                              onClick={() => handlePrestamo(id, 'entregar')}
                            />
                            <span className='tooltip'>Entregar</span>
                          </div>
                        )}

                        {(estadoId === 2 || estadoId === 3) && (
                          <div className='tooltip-container'>
                            <Icon
                              icon='system-uicons:check-circle-outside'
                              width='24'
                              strokeWidth={1.2}
                              onClick={() => handlePrestamo(id, 'completar')}
                            />
                            <span className='tooltip'>Completar</span>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan={7} className='notFound--message'>No se encontró ningun prestamo.</td>
                </tr>
                )
          }
        </tbody>
      </table>

      <Pagination page={page} setPage={setPage} maxPage={maxPage} />

      <ConfirmModal
        icon={danger}
        title='¿Está seguro que desea cancelar este prestamo?'
        message={
          <MensajeDesactivar
            codigo={deactivateElement.codigo}
            usuario={deactivateElement.usuario}
            solicitante={deactivateElement.solicitante}
          />
        }
        showModal={showModal}
        setShowModal={setShowModal}
        action={handleDeactivate}
      />
    </>
  )
}

const MensajeDesactivar = ({ codigo, usuario, solicitante }) => {
  return (
    <>
      <p>ID del prestamo: {codigo}</p>
      <p>Prestamista: {usuario}</p>
      <p>Solicitante: {solicitante}</p>
    </>
  )
}
