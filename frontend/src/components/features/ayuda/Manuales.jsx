import { Icon } from '@iconify/react'

export default function Manuales() {
  return (
    <>
      <span className='title'>Manuales</span>

      <div className='manualesContainer'>
        <a
          className='descargarManual'
          href='../../../assets/files/Elementos.pdf'
          download='manual sección elementos'
        >
          <Icon icon='system-uicons:file-download' width='32' strokeWidth={1.2} />
          Descargar manual de sección de elementos
        </a>

        <a
          className='descargarManual'
          href='../../../assets/files/Usuarios.pdf'
          download='manual sección usuarios'
        >
          <Icon icon='system-uicons:file-download' width='32' strokeWidth={1.2} />
          Descargar manual de sección de usuarios
        </a>

        <a
          className='descargarManual'
          href='../../../assets/files/Prestamos.pdf'
          download='manual sección prestamos'
        >
          <Icon icon='system-uicons:file-download' width='32' strokeWidth={1.2} />
          Descargar manual de sección de prestamos
        </a>

        <a
          className='descargarManual'
          href='../../../assets/files/Roles.pdf'
          download='manual sección roles'
        >
          <Icon icon='system-uicons:file-download' width='32' strokeWidth={1.2} />
          Descargar manual de sección de roles
        </a>

        <a
          className='descargarManual'
          href='../../../assets/files/Configuraciones.pdf'
          download='manual sección configuración'
        >
          <Icon icon='system-uicons:file-download' width='32' strokeWidth={1.2} />
          Descargar manual de sección de configuración
        </a>
      </div>
    </>
  )
}
