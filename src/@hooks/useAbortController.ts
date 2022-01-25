import { useRef, useEffect, useCallback } from 'react'
export const useAbortController = (): (() => AbortSignal) => {
  const axiosSource = useRef(null)
  const newAbortController = useCallback(() => {
    axiosSource.current = new AbortController()
    return axiosSource.current.signal
  }, [])

  useEffect(
    () => () => {
      if (axiosSource.current) axiosSource.current.abort()
    },
    []
  )

  return newAbortController
}
