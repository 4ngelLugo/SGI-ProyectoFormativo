import { useState } from 'react'
import { useCreate, useFetch } from '../../../hooks'
import '../../../styles/globals/forms.css'

export default function CreateElements ({ setAlert }) {
  // Hook para manejar la creación de elementos, incluyendo la lógica para el formulario y el tipo de elemento
  const { formRef, handleSubmit } = useCreate({ setAlert, obtener: 'elemento' })

  // Obtiene los datos de las areas, categorias, marcas, y los filtra para no mostrar aquellos que esten desactivados
  const { elements: areas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'areas' })
  const filteredAreas = areas.filter((el) => el.estado === 'activo')

  const { elements: categorias } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'categorias' })
  const filteredCategorias = categorias.filter((el) => el.estado === 'activo')

  const { elements: marcas } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'marcas' })
  const filteredMarcas = marcas.filter((el) => el.estado === 'activo')

  // Estado para el tipo de elemento que quiera registrar el usuario
  const [tipo, setTipo] = useState('devolutivo')

  return (
    <>
      <span className='title'>Registrar Elemento</span>

      {/* Formulario para registrar un nuevo elemento */}
      <form className='form form--elements' ref={formRef} onSubmit={handleSubmit}>
        <input type='number' placeholder='Codigo' name='ele_codigo' id='ele_codigo' />
        <input type='text' placeholder='Nombre' name='ele_nombre' id='ele_nombre' />
        <select name='ele_categoria' id='ele_categoria' defaultValue=''>
          <option value='' hidden>Categoria</option>
          {filteredCategorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
          ))}
        </select>
        <select name='ele_area' id='ele_area' defaultValue=''>
          <option value='' hidden>Area</option>
          {filteredAreas.map((area) => (
            <option key={area.id} value={area.id}>{area.nombre}</option>
          ))}
        </select>

        {/* Selección del tipo de elemento (devolutivo o consumible) */}
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

        {/* Campos específicos para tipo devolutivo o consumible */}
        {
          tipo === 'devolutivo'
            ? (
              <>
                <input type='text' placeholder='Placa' name='ele_placa' id='ele_placa' />
                <input type='text' placeholder='Serial' name='ele_serial' id='ele_serial' />
                <select name='ele_area' id='ele_area' defaultValue=''>
                  <option value='' hidden>Marca</option>
                  {filteredMarcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                  ))}
                </select>
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
