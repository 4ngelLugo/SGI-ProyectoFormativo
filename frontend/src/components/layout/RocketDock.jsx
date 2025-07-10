import { useEffect, useCallback, useState } from 'react'

// Importa dinamicamente las imágenes del RocketDock
const images = import.meta.glob('../../assets/images/rocketDock/*.{png,jpg,jpeg,svg,webp}', { eager: true })

// Convierte las imágenes en una lista ordenada de objetos { name, src }
const imageList = Object.entries(images)
  .map(([path, img]) => {
    const fileName = path.split('/').pop().replace(/\.\w+$/, '')
    return { name: fileName, src: img.default }
  })
  .sort((a, b) => {
    const order = [
      'elementos', 'usuarios', 'prestamos', 'estadisticas', 'roles', 'configuración', 'ayuda'
    ]

    return order.indexOf(a.name) - order.indexOf(b.name)
  })

export default function RocketDock({ onIconClick, openWindows, permisos }) {
  // Estado para controlar la visivilidad del RocketDock
  const [isVisible, setIsVisible] = useState(true)

  const hideRocketDock = useCallback((event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
      event.preventDefault()

      setIsVisible(prev => !prev)
    }
  }, [])

  // Añade el manejador para el evento 'keydown'
  useEffect(() => {
    document.addEventListener('keydown', hideRocketDock)
    return () => document.removeEventListener('keydown', hideRocketDock)
  }, [hideRocketDock])

  return (
    <section
      className={`rocketDock ${!isVisible ? 'rocketDock--hidden' : ''}`}
    >
      {/* Mapeo de los iconos del RocketDock, muestra las ventanas según los permisos del rol. Siempre muestra la ventana de ayuda */}
      {imageList.map(({ name, src }) => {
        const mostrar =
          name === 'ayuda' || permisos?.data?.some(p => p.modulo === name)

        return mostrar && (
          <RocketDockItem
            key={name}
            icon={src}
            onClick={() => onIconClick(name)}
            open={openWindows.includes(name)}
            name={name}
          />
        )
      })}

    </section>
  )
}

// Componente para renderizar cada objeto del RocketDock
function RocketDockItem({ icon, onClick, open, name }) {
  return (
    <div
      className={`rocketDock--item tooltip-container ${open ? 'rocketDock--item__open' : ''}`}
      onClick={onClick}
    >
      <span className='tooltip' style={{ bottom: '170%' }}>{name}</span>
      <img src={icon} alt={`${icon} icon`} className='rocketDock--item__icon' />
      {open && <div className='rocketDock--item__indicator' />}
    </div>
  )
}
