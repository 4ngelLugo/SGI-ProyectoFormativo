import { useEffect, useState } from "react"
import { FetchElementsEndpoint, DeactivateElementsEndPoint } from "../../config/apiRoutes"
import danger from '../../assets/icons/danger.svg'

import { Icon } from '@iconify/react'

export default function ListElements({ setAlert, setActiveView, setSearchedElement }) {

  const [elements, setElements] = useState([])
  const [deactivateElement, setDeactivateElement] = useState({ code: null, name: null, type: null })
  const [showModal, setShowModal] = useState(false)

  const handleAlert = (codigo, nombre, tipo) => {
    setDeactivateElement({ code: codigo, name: nombre, type: tipo })
    setShowModal(true)
  }

  const handleDeactivate = () => {
    fetch(DeactivateElementsEndPoint, {
      method: 'POST',
      body: JSON.stringify(deactivateElement),
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          switch (response.error) {
            case 'elemento no existe':
              setAlert({ type: 'error', message: 'El elemento a deshabilitar no existe', active: true })
              break
            case 'error al deshabilitar el elemento':
              setAlert({ type: 'error', message: 'Ocurrio un error al deshabilitar el elemento', active: true })
              break
            case 'database connection error':
              setAlert({ type: 'error', message: 'Error al conectar con la base de datos', active: true })
              break
          }
        } else if (response.success) {
          setElements((prevElements) =>
            prevElements.filter(
              (element) => element.codigo !== deactivateElement.code
            )
          );
          setAlert({ type: 'success', message: 'Elemento desactivado correctamente', active: true })
        }
      })
      .catch((error) => {
        console.error(error)
        setAlert({ type: 'error', message: 'Ocurrio un error al deshabilitar el elemento', active: true })
      })
  }

  useEffect(() => {
    fetch(FetchElementsEndpoint)
      .then((res) => res.json())
      .then((response) => {
        setElements(response)
      })
      .catch((error) => {
        console.error(error)
        setAlert({ type: 'error', message: 'Error al cargar los elementos', active: true })
      })
  }, [])

  return (
    <>
      <span className="title">Listar Elementos</span>

      <table className="table">
        <thead className="table__header">
          <tr className="table__row">
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Area</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="table__body">
          {elements && elements.map(({ codigo, nombre, area, tipo, estado }, index) => (
            <tr key={index} className={`table__row ${index % 2 === 1 ? 'table__row--alt' : ''}`}>
              <td>{codigo}</td>
              <td>{nombre}</td>
              <td>{area}</td>
              <td>{tipo}</td>
              <td>{estado}</td>
              <td className="table__body--actions">
                <div className="tooltip-container">
                  <Icon
                    icon="system-uicons:eye"
                    width="24" strokeWidth={1.2}
                    onClick={() => {
                      setActiveView('seeElement')
                      setSearchedElement(codigo)
                      setElements([]) // Limpiar la lista de elementos para evitar conflictos
                    }} />
                  <span className="tooltip">Ver</span>
                </div>
                <div className="tooltip-container">
                  <Icon icon="system-uicons:create" width="24" strokeWidth={1.2} />
                  <span className="tooltip">Editar</span>
                </div>
                <div className="tooltip-container">
                  <Icon icon="system-uicons:trash" width="24" strokeWidth={1.2} onClick={() => handleAlert(codigo, nombre, tipo)} />
                  <span className="tooltip">Deshabilitar</span>
                </div>
                <div className="tooltip-container">
                  <Icon icon="system-uicons:settings" width="24" strokeWidth={1.2} />
                  <span className="tooltip">Mantenimiento</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal deshabilitar elemento */}
      <div className={`deactivate__modal--container ${showModal ? 'show' : ''}`}>
        <div className="deactivate__modal">
          {danger && <img src={danger} alt="" width='64px' />}
          <p>¿Está seguro que desea deshabilitar este elemento?</p>
          <span>{deactivateElement.code} - {deactivateElement.name}</span>

          <div>
            <button onClick={() => setShowModal(false)} className="deactivate__modal--cancel">Cancelar</button>
            <button
              onClick={() => {
                setShowModal(false)
                handleDeactivate()
              }}
              className="deactivate__modal--confirm">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
