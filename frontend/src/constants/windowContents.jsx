import CreateElement from '../components/features/elementos/CreateElement'
import EditElement from '../components/features/elementos/EditElement'
import ListElements from '../components/features/elementos/ListElements'
import SearchElements from '../components/features/elementos/SearchElements'

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
      { key: 'listElement', icon: 'system-uicons:clipboard-notes', label: 'Lista elementos' },
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
  terminal: {
    sidebar: [
      { key: 'listarRoles', icon: 'system-uicons:question-circle', label: 'Listar roles' },
      { key: 'crearRol', icon: 'system-uicons:question-circle', label: 'Crear rol' },
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
  }
}
