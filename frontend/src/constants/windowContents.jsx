import CreateElement from '../components/features/elementos/CreateElement'
import EditElement from '../components/features/elementos/EditElement'
import ListElements from '../components/features/elementos/ListElements'
import SearchElements from '../components/features/elementos/SearchElements'

import ListarUsuarios from '../components/features/usuarios/ListarUsuarios'
import CrearUsuario from '../components/features/usuarios/CrearUsuario'
import BuscarUsuario from '../components/features/usuarios/BuscarUsuario'
import EditarUsuario from '../components/features/usuarios/EditarUsuario'

import CrearPrestamo from '../components/features/prestamos/CrearPrestamo'
import ListarPrestamos from '../components/features/prestamos/ListarPrestamos'
import BuscarPrestamo from '../components/features/prestamos/BuscarPrestamo'

import ListarRoles from '../components/features/roles/ListarRoles'
import CrearRol from '../components/features/roles/CrearRol'
import EditarRol from '../components/features/roles/EditarRol'
import BuscarRol from '../components/features/roles/BuscarRol'

import ListarAreas from '../components/features/configuracion/ListarAreas'
import ListarCategorias from '../components/features/configuracion/ListarCategorias'
import ListarMarcas from '../components/features/configuracion/ListarMarcas'
import ListarTipoDocumento from '../components/features/configuracion/ListarTipoDocumento'

const iconos = {
  listar: 'system-uicons:clipboard-notes',
  crear: 'system-uicons:clipboard-add',
  buscar: 'system-uicons:eye'
}

export const windowContents = {
  elementos: {
    sidebar: [
      { key: 'listElement', icon: iconos.listar, label: 'Listar elementos' },
      { key: 'createElement', icon: iconos.crear, label: 'Crear elemento' },
      { key: 'searchElement', icon: iconos.buscar, label: 'Buscar elemento' }
    ],
    views: {
      listElement: ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedItem, setSearchedEdit }) =>
        <ListElements
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
          setActiveView={setActiveView}
          setSearchedItem={setSearchedItem}
          setSearchedEdit={setSearchedEdit}
        />,
      createElement: ({ setAlert }) =>
        <CreateElement setAlert={setAlert} />,
      searchElement: ({ setAlert, searchedItem, setSearchedItem }) =>
        <SearchElements
          setAlert={setAlert}
          searchedItem={searchedItem}
          setSearchedItem={setSearchedItem}
        />,
      editElement: ({ setAlert, searchedEdit }) =>
        <EditElement
          setAlert={setAlert}
          searchedEdit={searchedEdit}
        />
    }
  },
  usuarios: {
    sidebar: [
      { key: 'listarUsuarios', icon: iconos.listar, label: 'Listar usuarios' },
      { key: 'crearUsuario', icon: iconos.crear, label: 'Crear usuario' },
      { key: 'buscarUsuario', icon: iconos.buscar, label: 'Buscar usuario' }
    ],
    views: {
      listarUsuarios: ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedItem, setSearchedEdit }) =>
        <ListarUsuarios
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
          setActiveView={setActiveView}
          setSearchedItem={setSearchedItem}
          setSearchedEdit={setSearchedEdit}
        />,
      crearUsuario: ({ setAlert }) =>
        <CrearUsuario setAlert={setAlert} />,
      buscarUsuario: ({ setAlert, searchedItem, setSearchedItem }) =>
        <BuscarUsuario
          setAlert={setAlert}
          searchedItem={searchedItem}
          setSearchedItem={setSearchedItem}
        />,
      editarUsuario: ({ setAlert, searchedEdit }) =>
        <EditarUsuario
          setAlert={setAlert}
          searchedEdit={searchedEdit}
        />
    }
  },
  configuración: {
    sidebar: [
      { key: 'listarAreas', icon: iconos.listar, label: 'Listar Areas' },
      { key: 'listarCategorias', icon: iconos.listar, label: 'Listar Categorias' },
      { key: 'listarMarcas', icon: iconos.listar, label: 'Listar Marcas' },
      { key: 'listarTipoDocumento', icon: iconos.listar, label: 'Listar Tipos de Documento' }
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
      { key: 'listarRoles', icon: iconos.listar, label: 'Listar roles' },
      { key: 'crearRol', icon: iconos.crear, label: 'Crear rol' },
      { key: 'buscarRol', icon: iconos.buscar, label: 'Buscar rol' }
    ],
    views: {
      listarRoles: ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedItem, setSearchedEdit }) =>
        <ListarRoles
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
          setActiveView={setActiveView}
          setSearchedItem={setSearchedItem}
          setSearchedEdit={setSearchedEdit}
        />,
      crearRol: ({ setAlert }) =>
        <CrearRol setAlert={setAlert} />,
      buscarRol: ({ setAlert, searchedItem, setSearchedItem }) =>
        <BuscarRol
          setAlert={setAlert}
          searchedItem={searchedItem}
          setSearchedItem={setSearchedItem}
        />,
      editarRol: ({ setAlert, searchedEdit }) =>
        <EditarRol
          setAlert={setAlert}
          searchedEdit={searchedEdit}
        />
    }
  },
  prestamos: {
    sidebar: [
      { key: 'listarPrestamos', icon: iconos.listar, label: 'Listar Prestamos' },
      { key: 'crearPrestamo', icon: iconos.crear, label: 'Solicitar Prestamo' },
      { key: 'buscarPrestamo', icon: iconos.buscar, label: 'Buscar Prestamo' },
    ],
    views: {
      listarPrestamos: ({ setAlert, windowHeight, isMaximized, setActiveView, setSearchedItem, setSearchedEdit }) =>
        <ListarPrestamos
          setAlert={setAlert}
          windowHeight={windowHeight}
          isMaximized={isMaximized}
          setActiveView={setActiveView}
          setSearchedItem={setSearchedItem}
          setSearchedEdit={setSearchedEdit}
        />,
      crearPrestamo: ({ setAlert }) =>
        <CrearPrestamo setAlert={setAlert} />,
      buscarPrestamo: ({ setAlert, searchedItem, setSearchedItem }) =>
        <BuscarPrestamo
          setAlert={setAlert}
          searchedItem={searchedItem}
          setSearchedItem={setSearchedItem}
        />,
    }
  }
}
