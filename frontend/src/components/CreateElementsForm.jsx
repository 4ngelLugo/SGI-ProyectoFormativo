import { useRef, useState } from "react"

export default function CreateElementsForm({ setAlert }) {
  const formRef = useRef(null)
  const [tipo, setTipo] = useState('devolutivo')

  const controllerAPI = 'http://localhost/sgi-proyectoformativo/backend/elementos/logic/saveLogic.php'

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(formRef.current)

    fetch(controllerAPI, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          switch (response.error) {
            case 'invalid method':
              setAlert({ type: 'error', message: 'Error en el metodo de envio', active: true })
              break
            case 'database connection error':
              setAlert({ type: 'error', message: 'Error al conectar con la base de datos', active: true })
              break
            case 'invalid type':
              setAlert({ type: 'error', message: 'Tipo de elemento invalido', active: true })
              break
            case 'campos vacios':
              setAlert({ type: 'error', message: 'Por favor llena todos los campos', active: true })
              break
            case 'elemento ya existe':
              setAlert({ type: 'error', message: 'Ya existe un elemento con el mismo codigo', active: true })
              break
            case 'error al guardar':
              setAlert({ type: 'error', message: 'Error al guardar el elemento', active: true })
              break
          }
        } else if (response.success) {
          setAlert({ type: 'success', message: 'Elemento guardado correctamente', active: true })
        }

      })
    .catch((error) => {
      console.error(error)
    })
  }

  return (
    <>
      <span className="form__title">Registrar Elemento</span>
      <form className='form' ref={formRef} onSubmit={handleSubmit}>
        <input type='number' placeholder='Codigo' name='ele_codigo' id='ele_codigo' />
        <input type='text' placeholder='Nombre' name='ele_nombre' id='ele_nombre' />
        <input type='number' placeholder='Area' name='ele_area' id='ele_area' />
        <div className={`form__type ${tipo === 'consumible' ? 'form__type--consumible' : ''}`}>
          <input
            type='radio'
            value='devolutivo'
            name='tipo'
            id='tipo-devolutivo'
            checked={tipo === 'devolutivo'}
            className={tipo === 'devolutivo' ? 'form__type--active' : ''}
            onChange={() => setTipo('devolutivo')} />
          <label htmlFor='tipo-devolutivo'>Devolutivo</label>

          <input
            type='radio'
            value='consumible'
            name='tipo'
            id='tipo-consumible'
            className={tipo === 'consumible' ? 'form__type--active' : ''}
            checked={tipo === 'consumible'}
            onChange={() => setTipo('consumible')} />
          <label htmlFor='tipo-consumible'>Consumible</label>
        </div>
        {tipo === 'devolutivo' ? (
          <>
            <input type='number' placeholder='Placa' name='ele_placa' id='ele_placa' />
            <input type='text' placeholder='Serial' name='ele_serial' id='ele_serial' />
            <input type='number' placeholder='Marca' name='ele_marca' id='ele_marca' />
            <input type='text' placeholder='Modelo' name='ele_modelo' id='ele_modelo' />
          </>
        ) : (
          <input type='number' placeholder='Cantidad' name='ele_cant' id='ele_cant' />
        )}
        <button className="form__button" type="submit">Enviar</button>
      </form>
    </>
  )
}
