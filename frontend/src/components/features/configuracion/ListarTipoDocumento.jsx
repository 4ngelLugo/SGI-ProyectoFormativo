import { useFetch, useDeactivate, useEdit, useCreate } from '../../../hooks'
import TooltipCell from '../../common/TooltipCell'
import ConfirmModal from '../../common/ConfirmModal'
import FormModal from '../../common/FormModal'
import Pagination from '../../common/Pagination'
import danger from '../../../assets/icons/danger.svg'
import '../../../styles/globals/tables.css'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export default function ListElements ({ setAlert, windowHeight, isMaximized, permisos }) {
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
  } = useFetch({ setAlert, windowHeight, isMaximized, obtener: 'tipoDocumento' })

  const { submitData } = useEdit({ setAlert, obtener: 'tipoDocumento' })

  // Hook para manejar la lógica de desactivación de elementos
  const {
    deactivateElement,
    setDeactivateElement,
    showModal,
    setShowModal,
    handleDeactivate
  } = useDeactivate({ setAlert, obtener: 'tipoDocumento', fetchElements })

  const {
    formRef,
    handleSubmit
  } = useCreate({ setAlert, obtener: 'tipoDocumento', fetchElements })

  // Maneja la activación del modal para deshabilitar un elemento
  const handleAlert = (id, nombre) => {
    setDeactivateElement({ codigo: id, nombre }) // Configura el elemento a deshabilitar
    setShowModal(true) // Muestra el modal de confirmación
  }

  return (
    <>
      <p className='title'>
        <span>Listar Tipos de documento</span>
        {permisos.data.some(p => p.id === 6) && (// 6: Registrar tipo documento
          <button
            className='btn_add'
            onClick={() => setCreateModal(true)}
          >
            +
          </button>
        )}
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
                {permisos.data.some(p => p.id === 22) && (// 22: Editar tipo documento
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
                )}
                {permisos.data.some(p => p.id === 30) && (// 30: Inhabilitar tipo documento
                  <div className='tooltip-container'>
                    <Icon icon='system-uicons:trash' width='24' strokeWidth={1.2} onClick={() => handleAlert(id, nombre)} />
                    <span className='tooltip'>Deshabilitar</span>
                  </div>
                )}
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
        title='Crear Tipo de documento'
        showModal={createModal}
        setShowModal={setCreateModal}
        formRef={formRef}
        handleSubmit={handleSubmit}
      />
    </>
  )
}
