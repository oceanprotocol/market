import { useCallback, useEffect, useRef } from 'react'

export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(true)
  const isMounted = useCallback(() => isMountedRef.current, [])

  useEffect(
    () => () => {
      isMountedRef.current = false
    },
    []
  )

  return isMounted
}
