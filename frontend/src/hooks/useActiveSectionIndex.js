import { useCallback, useEffect, useRef, useState } from 'react'

function useActiveSectionIndex(itemCount) {
  const itemRefs = useRef([])
  const frameRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const setItemRef = useCallback((index) => (node) => {
    itemRefs.current[index] = node
  }, [])

  useEffect(() => {
    const nodes = itemRefs.current.slice(0, itemCount).filter(Boolean)
    if (!nodes.length) return undefined

    const updateActiveIndex = () => {
      frameRef.current = null
      const viewportCenter = window.innerHeight / 2
      const nextIndex = nodes.reduce((closestIndex, node, index) => {
        const rect = node.getBoundingClientRect()
        const distance = Math.abs((rect.top + rect.height / 2) - viewportCenter)
        const closestRect = nodes[closestIndex].getBoundingClientRect()
        const closestDistance = Math.abs((closestRect.top + closestRect.height / 2) - viewportCenter)

        return distance < closestDistance ? index : closestIndex
      }, 0)

      setActiveIndex(nextIndex)
    }

    const scheduleUpdate = () => {
      if (frameRef.current) return
      frameRef.current = window.requestAnimationFrame(updateActiveIndex)
    }

    updateActiveIndex()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    }
  }, [itemCount])

  return { activeIndex, setItemRef }
}

export default useActiveSectionIndex
