import CreateElement from '../components/features/elementos/CreateElement'
import EditElement from '../components/features/elementos/EditElement'
import ListElements from '../components/features/elementos/ListElements'
import SearchElements from '../components/features/elementos/SearchElements'

export const windowContents = {
  finder: {
    sidebar: [
      { key: 'listElement', icon: 'system-uicons:clipboard-notes', label: 'Lista elementos' },
      { key: 'createElement', icon: 'system-uicons:clipboard-add', label: 'Crear elemento' },
      { key: 'searchElement', icon: 'system-uicons:eye', label: 'Ver elemento' },
      { key: 'editElement', icon: 'system-uicons:create', label: 'Editar elemento' }
    ],
    views: {
      listElement: ({ setAlert, setActiveView, setSearchedElement }) =>
        <ListElements
          setAlert={setAlert}
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
  }
}
