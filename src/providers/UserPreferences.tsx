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
import { useOcean } from '@oceanprotocol/react'
import { getNetworkName } from '../utils/wallet'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'

interface UserPreferencesValue {
  debug: boolean
  currency: string
  locale: string
  bookmarks: {
    [network: string]: string[]
  }
  setDebug: (value: boolean) => void
  setCurrency: (value: string) => void
  addBookmark: (did: string) => void
  removeBookmark: (did: string) => void
}

const UserPreferencesContext = createContext(null)

const localStorageKey = 'ocean-user-preferences'

function getLocalStorage(): UserPreferencesValue {
  const storageParsed =
    typeof window !== 'undefined' &&
    JSON.parse(window.localStorage.getItem(localStorageKey))
  return storageParsed
}

function setLocalStorage(values: Partial<UserPreferencesValue>) {
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
  const { config } = useOcean()
  const networkName = (config as ConfigHelperConfig).network
  const localStorage = getLocalStorage()

  // Set default values from localStorage
  const [debug, setDebug] = useState<boolean>(localStorage?.debug || false)
  const [currency, setCurrency] = useState<string>(
    localStorage?.currency || 'EUR'
  )
  const [locale, setLocale] = useState<string>()
  const [bookmarks, setBookmarks] = useState(localStorage?.bookmarks || {})

  // Write values to localStorage on change
  useEffect(() => {
    setLocalStorage({ debug, currency, bookmarks })
  }, [debug, currency, bookmarks])

  // Set ocean.js log levels, default: Error
  useEffect(() => {
    debug === true
      ? Logger.setLevel(LogLevel.Verbose)
      : Logger.setLevel(LogLevel.Error)
  }, [debug])

  // Get locale always from user's browser
  useEffect(() => {
    if (!window) return
    setLocale(window.navigator.language)
  }, [])

  function addBookmark(didToAdd: string): void {
    const newPinned = {
      ...bookmarks,
      [networkName]: [didToAdd].concat(bookmarks[networkName])
    }
    setBookmarks(newPinned)
  }

  function removeBookmark(didToAdd: string): void {
    const newPinned = {
      ...bookmarks,
      [networkName]: bookmarks[networkName].filter(
        (did: string) => did !== didToAdd
      )
    }
    setBookmarks(newPinned)
  }

  // Bookmarks old data structure migration
  useEffect(() => {
    if (!bookmarks.length) return
    const newPinned = { mainnet: bookmarks as any }
    setBookmarks(newPinned)
  }, [bookmarks])

  return (
    <UserPreferencesContext.Provider
      value={
        {
          debug,
          currency,
          locale,
          bookmarks,
          setDebug,
          setCurrency,
          addBookmark,
          removeBookmark
        } as UserPreferencesValue
      }
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

// Helper hook to access the provider values
const useUserPreferences = (): UserPreferencesValue =>
  useContext(UserPreferencesContext)

export { UserPreferencesProvider, useUserPreferences, UserPreferencesValue }
