import CreateElements from '../components/Elementos/CreateElements'
import ListElements from '../components/elementos/ListElements'
import SeeElements from '../components/elementos/SeeElements'

export const windowContents = {
  finder: {
    sidebar: [
      { key: 'listElement', icon: 'system-uicons:clipboard-notes', label: 'Lista elementos' },
      { key: 'createElement', icon: 'system-uicons:clipboard-add', label: 'Crear elemento' },
      { key: 'seeElement', icon: 'system-uicons:eye', label: 'Ver elemento' }
    ],
    views: {
      listElement: ({ setAlert, setActiveView, setSearchedElement }) => <ListElements setAlert={setAlert} setActiveView={setActiveView} setSearchedElement={setSearchedElement} />,
      createElement: ({ setAlert }) => <CreateElements setAlert={setAlert} />,
      seeElement: ({ setAlert, searchElement }) => <SeeElements setAlert={setAlert} searchElement={searchElement} />
    }
  }
}
