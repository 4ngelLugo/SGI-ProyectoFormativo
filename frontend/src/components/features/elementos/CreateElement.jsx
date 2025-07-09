import { useEffect, useState } from 'react'
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

        <Input type='number' placeholder='Código (numérico)' name='ele_codigo' required />
        <Input type='text' placeholder='Nombre' name='ele_nombre' required />
        <SelectInput options={filteredCategorias} placeholder='Categoría' name='ele_categoria' required setTipo={setTipo} />
        <SelectInput options={filteredAreas} placeholder='Área' name='ele_area' required />

        <input type='hidden' value={tipo} name='ele_tipo' />

        {tipo === 'devolutivo'
          ? (
            <>
              <Input type='text' placeholder='Placa' name='ele_placa' required />
              <Input type='text' placeholder='Serial' name='ele_serial' required />
              <SelectInput options={filteredMarcas} placeholder='Marca' name='ele_marca' required />
              <Input type='text' placeholder='Modelo' name='ele_modelo' required />
            </>
            )
          : tipo === 'consumible' && (
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
