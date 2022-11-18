import { useRef, useEffect, useCallback } from 'react'
import axios, { CancelToken } from 'axios'

export const useCancelToken = (): (() => CancelToken) => {
  const axiosSource = useRef(null)

  const newCancelToken = useCallback(() => {
    axiosSource.current = axios.CancelToken.source()
    return axiosSource?.current?.token
  }, [])

  useEffect(
    () => () => {
      if (axiosSource.current) axiosSource.current.cancel()
    },
    []
  )

  return newCancelToken
}
