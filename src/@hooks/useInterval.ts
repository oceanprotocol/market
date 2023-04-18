import { useEffect, useRef } from 'react'

export const useInterval = (
  callback: () => Promise<void>,
  delay: number | null | false
) => {
  const savedCallback = useRef<() => Promise<void>>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => {
      savedCallback?.current()
    }

    if (delay) {
      const id = setInterval(tick, delay)
      return () => {
        clearInterval(id)
      }
    }
  }, [callback, delay])
}
