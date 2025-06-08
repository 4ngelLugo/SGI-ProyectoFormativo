import { useCreate, useFetch } from '../../../hooks'
import '../../../styles/globals/forms.css'

export default function CrearUsuario ({ setAlert }) {
  // Hook para manejar la creación de usuarios, incluyendo la lógica para el formulario y el tipo de elemento
  const { formRef, handleSubmit } = useCreate({ setAlert, obtener: 'usuario' })

  // Obtiene los datos de las tipos de documento y roles, y los filtra para no mostrar aquellos que esten desactivados
  const { elements: tipoDocumento } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'tipoDocumento' })
  const filteredTipos = tipoDocumento.filter((el) => el.estado === 'activo')

  const { elements: roles } = useFetch({ setAlert, windowHeight: null, isMaximized: null, obtener: 'roles' })
  const filteredRoles = roles.filter((el) => el.estado === 'activo')

  return (
    <>
      <span className='title'>Registrar Usuario</span>

      {/* Formulario para registrar un nuevo elemento */}
      <form className='form form--elements' ref={formRef} onSubmit={handleSubmit}>
        <input type='number' placeholder='N° de Documento' name='documento' id='documento' />
        <select name='tipo_documento' id='tipo_documento' defaultValue=''>
          <option value='' hidden>Tipo de documento</option>
          {filteredTipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
          ))}
        </select>
        <input type='text' placeholder='Nombres' name='nombres' id='nombres' />
        <input type='text' placeholder='Apellidos' name='apellidos' id='apellidos' />
        <input type='tel' placeholder='Telefono' name='telefono' id='telefono' />
        <input type='tel' placeholder='Dirección' name='direccion' id='direccion' />
        <input type='email' placeholder='Correo Electronico' name='correo' id='correo' />
        <select name='rol' id='rol' defaultValue=''>
          <option value='' hidden>Rol</option>
          {filteredRoles.map((rol) => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
        </select>
        <input type='password' placeholder='Contraseña' name='contrasena' id='contrasena' />
        <input type='password' placeholder='Confirmar contraseña' name='confirmar' id='confirmar' />

        <button className='form__button' type='submit'>Enviar</button>
      </form>
    </>
  )
}
