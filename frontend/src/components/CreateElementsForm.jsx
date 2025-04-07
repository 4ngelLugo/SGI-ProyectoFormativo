import { useRef, useState } from "react"

export default function CreateElementsForm() {
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
        console.log(response)
      })
      // .catch((error) => {
      //   console.error(error)
      // })
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
