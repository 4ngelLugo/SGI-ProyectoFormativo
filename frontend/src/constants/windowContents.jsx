import CreateElement from '../components/features/elementos/CreateElement'
import EditElement from '../components/features/elementos/EditElement'
import ListElements from '../components/features/elementos/ListElements'
import SearchElements from '../components/features/elementos/SearchElements'

import ListarUsuarios from '../components/features/usuarios/ListarUsuarios'
import CrearUsuario from '../components/features/usuarios/CrearUsuario'
import BuscarUsuario from '../components/features/usuarios/BuscarUsuario'
import EditarUsuario from '../components/features/usuarios/EditarUsuario'

import CrearPrestamo from '../components/features/prestamos/CrearPrestamo'

import ListarRoles from '../components/features/roles/ListarRoles'
import CrearRol from '../components/features/roles/CrearRol'
import EditarRol from '../components/features/roles/EditarRol'
import BuscarRol from '../components/features/roles/BuscarRol'

import ListarAreas from '../components/features/configuracion/ListarAreas'
import ListarCategorias from '../components/features/configuracion/ListarCategorias'
import ListarMarcas from '../components/features/configuracion/ListarMarcas'
import ListarTipoDocumento from '../components/features/configuracion/ListarTipoDocumento'

export const windowContents = {
  finder: {
    sidebar: [
      { key: 'listElement', icon: 'system-uicons:clipboard-notes', label: 'Listar elementos' },
      { key: 'createElement', icon: 'system-uicons:clipboard-add', label: 'Crear elemento' },
      { key: 'searchElement', icon: 'system-uicons:eye', label: 'Ver elemento' },
      { key: 'editElement', icon: 'system-uicons:create', label: 'Editar elemento' }
    ],
    views: {
      listElement: ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedElement }) =>
        <ListElements
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
          setActiveView={setActiveView}
          setSearchedElement={setSearchedElement}
        />,
      createElement: ({ setAlert }) =>
        <CreateElement setAlert={setAlert} />,
      searchElement: ({ setAlert, searchElement, setSearchedElement }) =>
        <SearchElements
          setAlert={setAlert}
          searchElement={searchElement}
          setSearchedElement={setSearchedElement}
        />,
      editElement: ({ setAlert, searchElement }) =>
        <EditElement
          setAlert={setAlert}
          searchElement={searchElement}
        />
    }
  },
  appstore: {
    sidebar: [
      { key: 'listarUsuarios', icon: 'system-uicons:clipboard-notes', label: 'Listar usuarios' },
      { key: 'crearUsuario', icon: 'system-uicons:clipboard-add', label: 'Crear usuario' },
      { key: 'buscarUsuario', icon: 'system-uicons:eye', label: 'Buscar usuario' },
      { key: 'editarUsuario', icon: 'system-uicons:create', label: 'Editar usuario' }
    ],
    views: {
      listarUsuarios: ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedElement }) =>
        <ListarUsuarios
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
          setActiveView={setActiveView}
          setSearchedElement={setSearchedElement}
        />,
      crearUsuario: ({ setAlert }) =>
        <CrearUsuario setAlert={setAlert} />,
      buscarUsuario: ({ setAlert, searchElement, setSearchedElement }) =>
        <BuscarUsuario
          setAlert={setAlert}
          searchElement={searchElement}
          setSearchedElement={setSearchedElement}
        />,
      editarUsuario: ({ setAlert, searchElement }) =>
        <EditarUsuario
          setAlert={setAlert}
          searchElement={searchElement}
        />
    }
  },
  settings: {
    sidebar: [
      { key: 'listarAreas', icon: 'system-uicons:clipboard-notes', label: 'Listar Areas' },
      { key: 'listarCategorias', icon: 'system-uicons:clipboard-notes', label: 'Listar Categorias' },
      { key: 'listarMarcas', icon: 'system-uicons:clipboard-notes', label: 'Listar Marcas' },
      { key: 'listarTipoDocumento', icon: 'system-uicons:clipboard-notes', label: 'Listar T.  Documento' }
    ],
    views: {
      listarAreas: ({ setAlert, windowHeight, isMaximized }) =>
        <ListarAreas
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
        />,
      listarCategorias: ({ setAlert, windowHeight, isMaximized }) =>
        <ListarCategorias
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
        />,
      listarMarcas: ({ setAlert, windowHeight, isMaximized }) =>
        <ListarMarcas
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
        />,
      listarTipoDocumento: ({ setAlert, windowHeight, isMaximized }) =>
        <ListarTipoDocumento
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
        />
    }
  },
  terminal: {
    sidebar: [
      { key: 'listarRoles', icon: 'system-uicons:question-circle', label: 'Listar roles' },
      { key: 'crearRol', icon: 'system-uicons:clipboard-add', label: 'Crear rol' },
      { key: 'buscarRol', icon: 'system-uicons:question-circle', label: 'Buscar rol' },
      { key: 'editarRol', icon: 'system-uicons:question-circle', label: 'Editar rol' }
    ],
    views: {
      listarRoles: ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedRole }) =>
        <ListarRoles
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
          setActiveView={setActiveView}
          setSearchedRole={setSearchedRole}
        />,
      crearRol: ({ setAlert }) =>
        <CrearRol setAlert={setAlert} />,
      buscarRol: ({ setAlert, searchRole, setSearchRole }) =>
        <BuscarRol
          setAlert={setAlert}
          searchRole={searchRole}
          setSearchRole={setSearchRole}
        />,
      editarRol: ({ setAlert, searchRole }) =>
        <EditarRol
          setAlert={setAlert}
          searchRole={searchRole}
        />
    }
  },
  mail: {
    sidebar: [
      { key: 'crearPrestamo', icon: 'system-uicons:clipboard-add', label: 'Solicitar Prestamo' },
    ],
    views: {
      crearPrestamo: ({ setAlert }) =>
        <CrearPrestamo setAlert={setAlert} />
    }
  },
}
