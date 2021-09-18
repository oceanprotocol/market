import { useRef, useEffect } from 'react'
import axios, { Cancel, CancelToken } from 'axios'
export const useCancelToken = (): (() => CancelToken) => {
  const axiosSource = useRef(null)
  const newCancelToken = (): CancelToken => {
    axiosSource.current = axios.CancelToken.source()
    return axiosSource.current.token
  }

  useEffect(
    () => () => {
      if (axiosSource.current) axiosSource.current.cancel()
    },
    []
  )

  return newCancelToken
}
