import { useState } from 'react'
import { useCreate, useFetch } from '../../../hooks'
import Input from '../../common/Input'
import SelectInput from '../../common/SelectInput'
import '../../../styles/globals/forms.css'

export default function CreateElements ({ setAlert, setActiveView }) {
  // Hook para manejar la creación de elementos, incluyendo la lógica para el formulario y el tipo de elemento
  const { formRef, handleSubmit } = useCreate({ setAlert, obtener: 'elemento', setActiveView })

  // Obtiene los datos de las áreas, categorías y marcas, y filtra los que están activos
  const { elements: areas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'areas' })
  const filteredAreas = areas.filter((el) => el.estado === 'activo')

  const { elements: categorias } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'categorias' })
  const filteredCategorias = categorias.filter((el) => el.estado === 'activo')

  const { elements: marcas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'marcas' })
  const filteredMarcas = marcas.filter((el) => el.estado === 'activo')

  // Estado para el tipo de elemento que desea registrar el usuario
  const [tipo, setTipo] = useState('')

  return (
    <>
      <span className='title'>Registrar elemento</span>

      <form className='form form--elements' ref={formRef} onSubmit={handleSubmit}>
        <p className='message'>Los campos marcados con asterisco (*) son obligatorios.</p>

        <Input type='text' placeholder='Código' name='codigo' required />
        <Input type='text' placeholder='Nombre' name='nombre' required />
        <SelectInput options={filteredCategorias} placeholder='Categoría' name='categoria' required setTipo={setTipo} />
        <SelectInput options={filteredAreas} placeholder='Área' name='area' required />

        <input type='hidden' value={tipo} name='tipo' />

        {tipo === 'devolutivo'
          ? (
            <>
              <Input type='number' placeholder='Placa (númerica)' name='placa' required />
              <Input type='text' placeholder='Serial' name='serial' required />
              <SelectInput options={filteredMarcas} placeholder='Marca' name='marca' required />
              <Input type='text' placeholder='Modelo' name='modelo' required />
            </>
            )
          : tipo === 'consumible' && (
            <>
              <Input type='number' placeholder='Cantidad (numérica)' name='cantidad' required />
              <Input type='text' placeholder='Unidad de medida' name='medida' required />
            </>
          )}

        <div className='recomendacion'>
          <label htmlFor='recomendacion' className='recomendacion__label'>Recomendaciones</label>
          <textarea
            name='recomendacion'
            id='recomendacion'
            className='recomendacion__textarea'
            placeholder={'Escribe recomendaciones aqui...\nej. Este elemento necesita x para funcionar...'}
          />
        </div>

        <button className='form__button' type='submit'>Enviar</button>
      </form>
    </>
  )
}
