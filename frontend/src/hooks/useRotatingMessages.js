import { useEffect, useState } from 'react'

function getNextIndex(length, currentIndex) {
  if (length <= 1) return 0

  let nextIndex = Math.floor(Math.random() * length)
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length)
  }

  return nextIndex
}

function useRotatingMessages(messages, visibleMs = 5000, pauseMs = 20000) {
  const [messageIndex, setMessageIndex] = useState(() => getNextIndex(messages.length, -1))
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!messages.length) return undefined

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false)
    }, visibleMs)

    const nextTimer = window.setTimeout(() => {
      setMessageIndex((currentIndex) => getNextIndex(messages.length, currentIndex))
      setIsVisible(true)
    }, visibleMs + pauseMs)

    return () => {
      window.clearTimeout(hideTimer)
      window.clearTimeout(nextTimer)
    }
  }, [messageIndex, messages.length, visibleMs, pauseMs])

  return { message: messages[messageIndex] || '', isVisible }
}

export default useRotatingMessages
