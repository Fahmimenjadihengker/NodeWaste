import { useEffect, useState } from 'react'

function getNextIndex(length, currentIndex) {
  if (length <= 1) return 0

  let nextIndex = Math.floor(Math.random() * length)
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length)
  }

  return nextIndex
}

function useRotatingMessages(messages, intervalMs = 10000) {
  const [messageIndex, setMessageIndex] = useState(() => getNextIndex(messages.length, -1))

  useEffect(() => {
    if (!messages.length) return undefined

    const intervalId = window.setInterval(() => {
      setMessageIndex((currentIndex) => getNextIndex(messages.length, currentIndex))
    }, intervalMs)

    return () => window.clearInterval(intervalId)
  }, [messages.length, intervalMs])

  return messages[messageIndex] || ''
}

export default useRotatingMessages
