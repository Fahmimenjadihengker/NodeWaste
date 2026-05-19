import { useEffect, useState } from 'react'

const defaultSelect = (response) => response.data

function readCached(getCached, select, fallback) {
  const cached = getCached?.()
  return cached ? select(cached) : fallback
}

export function useCachedResource({ getCached, load, select = defaultSelect, fallback }) {
  const [data, setData] = useState(() => readCached(getCached, select, fallback))
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(() => !getCached?.())

  useEffect(() => {
    let isMounted = true

    load()
      .then((response) => {
        if (!isMounted) return
        setData(select(response))
        setError('')
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [getCached, load, select])

  return { data, setData, error, isLoading, setError }
}

export default useCachedResource
