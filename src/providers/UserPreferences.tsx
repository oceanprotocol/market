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
  currency: string
  locale: string
  chainIds: number[]
  bookmarks: string[]
  privacyPolicySlug: string
  setChainIds: (chainIds: number[]) => void
  setDebug: (value: boolean) => void
  setCurrency: (value: string) => void
  addBookmark: (did: string) => void
  removeBookmark: (did: string) => void
  setPrivacyPolicySlug: (slug: string) => void
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
  const { defaultPrivacyPolicySlug } = useSiteMetadata().appConfig
  const [privacyPolicySlug, setPrivacyPolicySlug] = useState<string>(
    localStorage?.privacyPolicySlug || defaultPrivacyPolicySlug
  )

  // Write values to localStorage on change
  useEffect(() => {
    setLocalStorage({ chainIds, debug, currency, bookmarks, privacyPolicySlug })
  }, [chainIds, debug, currency, bookmarks, privacyPolicySlug])

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
          privacyPolicySlug,
          setChainIds,
          setDebug,
          setCurrency,
          addBookmark,
          removeBookmark,
          setPrivacyPolicySlug
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
