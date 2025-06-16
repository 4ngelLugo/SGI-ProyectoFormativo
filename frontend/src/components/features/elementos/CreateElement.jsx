import { useState } from 'react'
import { useCreate, useFetch } from '../../../hooks'
import Input from '../../common/Input'
import SelectInput from '../../common/SelectInput'
import '../../../styles/globals/forms.css'

export default function CreateElements ({ setAlert }) {
  // Hook para manejar la creación de elementos, incluyendo la lógica para el formulario y el tipo de elemento
  const { formRef, handleSubmit } = useCreate({ setAlert, obtener: 'elemento' })

  // Obtiene los datos de las áreas, categorías y marcas, y filtra los que están activos
  const { elements: areas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'areas' })
  const filteredAreas = areas.filter((el) => el.estado === 'activo')

  const { elements: categorias } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'categorias' })
  const filteredCategorias = categorias.filter((el) => el.estado === 'activo')

  const { elements: marcas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'marcas' })
  const filteredMarcas = marcas.filter((el) => el.estado === 'activo')

  // Estado para el tipo de elemento que desea registrar el usuario
  const [tipo, setTipo] = useState('devolutivo')

  return (
    <>
      <span className='title'>Registrar elemento</span>

      <form className='form form--elements' ref={formRef} onSubmit={handleSubmit}>
        <p className='message'>Los campos marcados con asterisco (*) son obligatorios.</p>

        <Input type='number' placeholder='Código (numérico)' name='ele_codigo' required />
        <Input type='text' placeholder='Nombre' name='ele_nombre' required />
        <SelectInput options={filteredCategorias} placeholder='Categoría' name='ele_categoria' required />
        <SelectInput options={filteredAreas} placeholder='Área' name='ele_area' required />

        <div className={`form__type ${tipo === 'consumible' ? 'form__type--consumible' : ''}`}>
          <input
            type='radio'
            value='devolutivo'
            name='ele_tipo'
            id='tipo-devolutivo'
            checked={tipo === 'devolutivo'}
            className={tipo === 'devolutivo' ? 'form__type--active' : ''}
            onChange={() => setTipo('devolutivo')}
          />
          <label htmlFor='tipo-devolutivo'>Devolutivo</label>

          <input
            type='radio'
            value='consumible'
            name='ele_tipo'
            id='tipo-consumible'
            className={tipo === 'consumible' ? 'form__type--active' : ''}
            checked={tipo === 'consumible'}
            onChange={() => setTipo('consumible')}
          />
          <label htmlFor='tipo-consumible'>Consumible</label>
        </div>

        {tipo === 'devolutivo'
          ? (
            <>
              <Input type='text' placeholder='Placa' name='ele_placa' required />
              <Input type='text' placeholder='Serial' name='ele_serial' required />
              <SelectInput options={filteredMarcas} placeholder='Marca' name='ele_marca' required />
              <Input type='text' placeholder='Modelo' name='ele_modelo' required />
            </>
            )
          : (
            <>
              <Input type='number' placeholder='Cantidad (numérica)' name='ele_cant' required />
              <Input type='text' placeholder='Unidad de medida' name='ele_medida' required />
            </>
            )}

        <button className='form__button' type='submit'>Enviar</button>
      </form>
    </>
  )
}
