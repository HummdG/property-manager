'use client'

import { useState, useCallback } from 'react'

export function useFetch(fetchFn) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await fetchFn(...args)
        setData(result)
        return result
      } catch (err) {
        setError(err.message || 'An error occurred')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchFn]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { execute, data, isLoading, error, reset }
}


