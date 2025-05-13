import { useCreateElement } from '../../../hooks'
import '../../../styles/globals/forms.css'

export default function CreateElements ({ setAlert }) {
  // Hook para manejar la creación de elementos, incluyendo la lógica para el formulario y el tipo de elemento
  const { formRef, tipo, setTipo, handleSubmit } = useCreateElement(setAlert)

  return (
    <>
      <span className='title'>Registrar Elemento</span>

      {/* Formulario para registrar un nuevo elemento */}
      <form className='form' ref={formRef} onSubmit={handleSubmit}>
        <input type='number' placeholder='Codigo' name='ele_codigo' id='ele_codigo' />
        <input type='text' placeholder='Nombre' name='ele_nombre' id='ele_nombre' />
        <input type='number' placeholder='Area' name='ele_area' id='ele_area' />

        {/* Selección del tipo de elemento (devolutivo o consumible) */}
        <div className={`form__type ${tipo === 'consumible' ? 'form__type--consumible' : ''}`}>
          <input
            type='radio'
            value='devolutivo'
            name='tipo'
            id='tipo-devolutivo'
            checked={tipo === 'devolutivo'}
            className={tipo === 'devolutivo' ? 'form__type--active' : ''}
            onChange={() => setTipo('devolutivo')}
          />
          <label htmlFor='tipo-devolutivo'>Devolutivo</label>

          <input
            type='radio'
            value='consumible'
            name='tipo'
            id='tipo-consumible'
            className={tipo === 'consumible' ? 'form__type--active' : ''}
            checked={tipo === 'consumible'}
            onChange={() => setTipo('consumible')}
          />
          <label htmlFor='tipo-consumible'>Consumible</label>
        </div>

        {/* Campos específicos para tipo devolutivo o consumible*/}
        {
          tipo === 'devolutivo'
            ? (
              <>
                <input type='number' placeholder='Placa' name='ele_placa' id='ele_placa' />
                <input type='text' placeholder='Serial' name='ele_serial' id='ele_serial' />
                <input type='number' placeholder='Marca' name='ele_marca' id='ele_marca' />
                <input type='text' placeholder='Modelo' name='ele_modelo' id='ele_modelo' />
              </>
              )
            : (
              <>
                <input type='number' placeholder='Cantidad' name='ele_cant' id='ele_cant' />
                <input type='text' placeholder='Unidad de medida' name='ele_medida' id='ele_medida' />
              </>
              )
        }
        <button className='form__button' type='submit'>Enviar</button>
      </form>
    </>
  )
}
