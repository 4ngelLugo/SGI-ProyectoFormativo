import { useEffect } from 'react'

export const useWindowVisibility = (winRef, isToggled) => {
  useEffect(() => {
    if (!winRef.current) return

    if (isToggled) {
      winRef.current.style.display = ''
      winRef.current.classList.add('isRestoring')
      setTimeout(() => {
        winRef.current.classList.remove('isRestoring')
      }, 200)
    } else {
      winRef.current.classList.add('isMinimizing')
      setTimeout(() => {
        winRef.current.style.display = 'none'
        winRef.current.classList.remove('isMinimizing')
      }, 300)
    }
  }, [isToggled])
}
