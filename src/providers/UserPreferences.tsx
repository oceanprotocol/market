import React, {
  createContext,
  useContext,
  ReactElement,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { Logger, LogLevel } from '@oceanprotocol/lib'
import { isBrowser } from '../utils'
import { useSiteMetadata } from '../hooks/useSiteMetadata'

interface UserPreferencesValue {
  debug: boolean
  setDebug: (value: boolean) => void
  currency: string
  setCurrency: (value: string) => void
  chainIds: number[]
  setChainIds: (chainIds: number[]) => void
  bookmarks: string[]
  addBookmark: (did: string) => void
  removeBookmark: (did: string) => void
  infiniteApproval: boolean
  setInfiniteApproval: (value: boolean) => void
  locale: string
}

const UserPreferencesContext = createContext(null)

const localStorageKey = 'ocean-user-preferences'

function getLocalStorage(): UserPreferencesValue {
  const storageParsed =
    isBrowser && JSON.parse(window.localStorage.getItem(localStorageKey))
  return storageParsed
}

function setLocalStorage(values: Partial<UserPreferencesValue>) {
  return (
    isBrowser &&
    window.localStorage.setItem(localStorageKey, JSON.stringify(values))
  )
}

function UserPreferencesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const localStorage = getLocalStorage()

  // Set default values from localStorage
  const [debug, setDebug] = useState<boolean>(localStorage?.debug || false)
  const [currency, setCurrency] = useState<string>(
    localStorage?.currency || 'EUR'
  )
  const [locale, setLocale] = useState<string>()
  const [bookmarks, setBookmarks] = useState(localStorage?.bookmarks || [])
  const [chainIds, setChainIds] = useState(
    localStorage?.chainIds || appConfig.chainIds
  )
  const [infiniteApproval, setInfiniteApproval] = useState(
    localStorage?.infiniteApproval || false
  )

  // Write values to localStorage on change
  useEffect(() => {
    setLocalStorage({ chainIds, debug, currency, bookmarks })
  }, [chainIds, debug, currency, bookmarks])

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
    const newPinned = [...bookmarks, didToAdd]
    setBookmarks(newPinned)
  }

  function removeBookmark(didToAdd: string): void {
    const newPinned = bookmarks.filter((did: string) => did !== didToAdd)
    setBookmarks(newPinned)
  }

  // Bookmarks old data structure migration
  useEffect(() => {
    if (bookmarks.length !== undefined) return
    const newPinned: string[] = []
    for (const network in bookmarks) {
      ;(bookmarks[network] as unknown as string[]).forEach((did: string) => {
        did !== null && newPinned.push(did)
      })
    }
    setBookmarks(newPinned)
  }, [bookmarks])

  return (
    <UserPreferencesContext.Provider
      value={
        {
          debug,
          currency,
          locale,
          chainIds,
          bookmarks,
          infiniteApproval,
          setInfiniteApproval,
          setChainIds,
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
