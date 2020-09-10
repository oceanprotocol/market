import React, {
  createContext,
  useContext,
  ReactElement,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { Logger } from '@oceanprotocol/lib'
import { LogLevel } from '@oceanprotocol/lib/dist/node/utils/Logger'

interface UserPreferencesValue {
  debug: boolean
  currency: string
  setDebug?: (value: boolean) => void
  setCurrency?: (value: string) => void
}

const UserPreferencesContext = createContext(null)

const localStorageKey = 'ocean-user-preferences'

function getLocalStorage() {
  const storageParsed =
    typeof window !== 'undefined' &&
    JSON.parse(window.localStorage.getItem(localStorageKey))
  return storageParsed
}

function setLocalStorage(values: UserPreferencesValue) {
  return (
    typeof window !== 'undefined' &&
    window.localStorage.setItem(localStorageKey, JSON.stringify(values))
  )
}

function UserPreferencesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const localStorage = getLocalStorage()

  // Set default values from localStorage
  const [debug, setDebug] = useState<boolean>(
    (localStorage && localStorage.debug) || false
  )
  const [currency, setCurrency] = useState<string>(
    (localStorage && localStorage.currency) || 'EUR'
  )

  // Write values to localStorage on change
  useEffect(() => {
    setLocalStorage({ debug, currency })
  }, [debug, currency])

  // Set ocen-lib-js log levels, default: Error
  useEffect(() => {
    debug === true
      ? Logger.setLevel(LogLevel.Verbose)
      : Logger.setLevel(LogLevel.Error)
  }, [debug])

  return (
    <UserPreferencesContext.Provider
      value={{ debug, currency, setDebug, setCurrency } as UserPreferencesValue}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

// Helper hook to access the provider values
const useUserPreferences = (): UserPreferencesValue =>
  useContext(UserPreferencesContext)

export { UserPreferencesProvider, useUserPreferences, UserPreferencesValue }
