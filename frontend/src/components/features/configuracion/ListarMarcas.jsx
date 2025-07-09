import { useFetch, useDeactivate, useEdit, useCreate } from '../../../hooks'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import FormModal from '../../common/FormModal'
import Pagination from '../../common/Pagination'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export default function ListarMarcas ({ setAlert, windowHeight, isMaximized }) {
  const [editingId, setEditingId] = useState(null)
  const [editedName, setEditedName] = useState('')
  const [createModal, setCreateModal] = useState(false)

  // Hook para manejar la lista de elementos y su paginación
  const {
    allElements: elements,
    setElements,
    page,
    setPage,
    maxPage,
    fetchElements
  } = useFetch({ setAlert, windowHeight, isMaximized, obtener: 'marcas' })

  const { submitData } = useEdit({ setAlert, obtener: 'marca' })

  // Hook para manejar la lógica de desactivación de elementos
  const {
    deactivateElement,
    setDeactivateElement,
    showModal,
    setShowModal,
    handleDeactivate
  } = useDeactivate({ setAlert, obtener: 'marca', fetchElements })

  const {
    formRef,
    handleSubmit
  } = useCreate({ setAlert, obtener: 'marca', fetchElements })

  // Maneja la activación del modal para deshabilitar un elemento
  const handleAlert = (id, nombre) => {
    setDeactivateElement({ codigo: id, nombre }) // Configura el elemento a deshabilitar
    setShowModal(true) // Muestra el modal de confirmación
  }

  return (
    <>
      <p className='title'>
        <span>Listar Marcas</span>
        <button
          className='btn_add'
          onClick={() => setCreateModal(true)}
        >
          +
        </button>
      </p>

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
              {
                editingId === id
                  ? (
                    <td>
                      <input
                        type='text'
                        value={editedName}
                        className='inputEdit'
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={async () => {
                          if (editedName === nombre) {
                            setEditingId(null)
                            return
                          }

                          const exito = await submitData({ id, nombre: editedName })

                          if (exito) {
                            const updatedElements = elements.map(el =>
                              el.id === id ? { ...el, nombre: editedName } : el
                            )
                            setElements(updatedElements)
                            setEditingId(null)
                          } else {
                            setEditedName(elements.find(el => el.id === id)?.nombre || '')
                            setEditingId(null)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.target.blur()
                          }
                        }}
                        autoFocus
                      />
                    </td>
                    )
                  : (
                    <TooltipCell text={nombre} />
                    )
              }
              <TooltipCell text={estado} />

              <td className='table__body--actions'>
                {/* Iconos de acciones para cada elemento */}
                <div className='tooltip-container'>
                  <Icon
                    icon='system-uicons:create'
                    width='24'
                    strokeWidth={1.2}
                    onClick={() => {
                      setEditingId(id)
                      setEditedName(nombre)
                    }}
                  />
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
        title='¿Está seguro que desea deshabilitar este elemento?'
        message={`${deactivateElement.codigo} - ${deactivateElement.nombre}`}
        showModal={showModal}
        setShowModal={setShowModal}
        action={handleDeactivate}
      />

      <FormModal
        title='Crear Marca'
        showModal={createModal}
        setShowModal={setCreateModal}
        formRef={formRef}
        handleSubmit={handleSubmit}
      />
    </>
  )
}
