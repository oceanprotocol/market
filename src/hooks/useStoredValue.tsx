import { isBrowser } from '../utils'
import { useEffect, useState } from 'react'

function useStoredValue<T>(
  key: string,
  initialState: T
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(initialState)

  useEffect(() => {
    if (isBrowser) {
      const storedValue = localStorage.getItem(key)
      if (storedValue) {
        setValue(JSON.parse(storedValue) as T)
      }
    }
  }, [])

  const updateValue = (newValue: T) => {
    if (isBrowser) {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
    setValue(JSON.parse(JSON.stringify(newValue)))
  }

  return [value, updateValue]
}

export default useStoredValue
