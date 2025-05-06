const images = import.meta.glob('../assets/images/rocketDockIcons/*.{png,jpg,jpeg,svg,webp}', { eager: true })
import { useRef, useEffect, useCallback, useState } from 'react'

const imageList = Object.entries(images)
  .map(([path, img]) => {
    const fileName = path.split('/').pop().replace(/\.\w+$/, '')
    return { name: fileName, src: img.default }
  })
  .sort((a, b) => {
    const order = [
      'finder', 'appstore', 'settings', 'calculator',
      'launchpad', 'mail', 'maps', 'message', 'music',
      'notes', 'photos', 'terminal', 'vscode', 'bin'
    ]

    return order.indexOf(a.name) - order.indexOf(b.name)
  })

export default function RocketDock({ onIconClick, openWindows }) {

  const [isVisible, setIsVisible] = useState(true)
  const rocketDock = useRef(null)

  const hideRocketDock = useCallback((event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
      event.preventDefault()

      setIsVisible(prev => {
        const newVisibility = !prev
        if (rocketDock.current) {
          rocketDock.current.style.bottom = newVisibility ? '' : '-100%'
        }
        return newVisibility
      })
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", hideRocketDock)
    return () => document.removeEventListener("keydown", hideRocketDock)
  }, [hideRocketDock])

  return (
    <section className='rocketDock' ref={rocketDock}>
      {imageList.map(({ name, src }) => {
        return (
          <RocketDockItem
            key={name}
            icon={src}
            onClick={() => onIconClick(name)}
            open={openWindows.includes(name)} />
        )
      })}
    </section>
  )
}

function RocketDockItem({ icon, onClick, open }) {
  return (
    <div className={`rocketDock--item ${open ? 'rocketDock--item__open' : ''}`} onClick={onClick}>
      <img src={icon} alt="Dock Icon" className="rocketDock--item__icon" />
      {open && <div className="rocketDock--item__indicator" />}
    </div>
  )
}

