import { useEdit, useFetch, useFetchByCode } from '../../../hooks'
import '../../../styles/globals/forms.css'

export default function EditarUsuario ({ setAlert, searchElement }) {
  // Hook para manejar la creación de usuarios, incluyendo la lógica para el formulario y el tipo de elemento
  const { formRef, handleSubmit } = useEdit({ setAlert, obtener: 'usuario' })

  const { loading, element } = useFetchByCode({ setAlert, codeToSearch: searchElement, obtener: 'usuario' })

  // Obtiene los datos de las tipos de documento y roles, y los filtra para no mostrar aquellos que esten desactivados
  const { elements: tipoDocumento } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'tipoDocumento' })
  const filteredTipos = tipoDocumento.filter((el) => el.estado === 'activo')

  const { elements: roles } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'roles' })
  const filteredRoles = roles.filter((el) => el.estado === 'activo')

  return (
    <>
      <span className='title'>Registrar Usuario</span>

      {
        loading
          ? <p>Cargando...</p>
          : element
            ? (
              <form className='form form--elements' ref={formRef} onSubmit={handleSubmit}>
                <input type='number' placeholder='N° de Documento' name='documento' id='documento' defaultValue={element.documento} />
                <select name='tipo_documento' id='tipo_documento' defaultValue={element.tipoDocumentoId || ''}>
                  <option value='' hidden>Tipo de documento</option>
                  {filteredTipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </select>
                <input type='text' placeholder='Nombres' name='nombres' id='nombres' defaultValue={element.nombres} />
                <input type='text' placeholder='Apellidos' name='apellidos' id='apellidos' defaultValue={element.apellidos} />
                <input type='tel' placeholder='Telefono' name='telefono' id='telefono' defaultValue={element.telefono} />
                <input type='tel' placeholder='Dirección' name='direccion' id='direccion' defaultValue={element.direccion} />
                <input type='email' placeholder='Correo Electronico' name='correo' id='correo' defaultValue={element.correo} />
                <select name='rol' id='rol' defaultValue={element.rol || ''}>
                  <option value='' hidden>Rol</option>
                  {filteredRoles.map((rol) => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>

                <button className='form__button' type='submit'>Enviar</button>
              </form>
              )
            : (
              <p>No se encontró el elemento</p>
              )
      }
    </>
  )
}
