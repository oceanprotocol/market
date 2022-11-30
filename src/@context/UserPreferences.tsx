import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { LoggerInstance, LogLevel } from '@oceanprotocol/lib'
import { isBrowser } from '@utils/index'
import { useMarketMetadata } from './MarketMetadata'
import { SignalOriginItem, SignalSettingsItem } from '@context/Signals/_types'

interface UserPreferencesValue {
  debug: boolean
  setDebug: (value: boolean) => void
  currency: string
  setCurrency: (value: string) => void
  chainIds: number[]
  privacyPolicySlug: string
  showPPC: boolean
  setChainIds: (chainIds: number[]) => void
  bookmarks: string[]
  addBookmark: (did: string) => void
  removeBookmark: (did: string) => void
  setPrivacyPolicySlug: (slug: string) => void
  setShowPPC: (value: boolean) => void
  infiniteApproval: boolean
  setInfiniteApproval: (value: boolean) => void
  locale: string
  signalSettings?: SignalSettingsItem
  signals: SignalOriginItem[]
  setSignalSettings(signalSettings: SignalSettingsItem): void
  addSignalSetting(signalSetting: SignalOriginItem): void
  removeSignalSetting(signalSettingId: string): void
  updateSignalSetting(
    signalOriginItem: SignalOriginItem,
    newSignalOriginItem: SignalOriginItem
  ): void
}

const UserPreferencesContext = createContext(null)

const localStorageKey = 'ocean-user-preferences-v4'

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
  const { appConfig } = useMarketMetadata()
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
  const { defaultPrivacyPolicySlug } = appConfig

  const [privacyPolicySlug, setPrivacyPolicySlug] = useState<string>(
    localStorage?.privacyPolicySlug || defaultPrivacyPolicySlug
  )

  const [showPPC, setShowPPC] = useState<boolean>(
    localStorage?.showPPC !== false
  )

  const [infiniteApproval, setInfiniteApproval] = useState(
    localStorage?.infiniteApproval || false
  )
  // Initialize signal settings
  let initSignalSettings: SignalSettingsItem = appConfig.signalSettings
  if (localStorage?.signalSettings) {
    if (localStorage.signalSettings && localStorage.signalSettings.version) {
      if (
        localStorage.signalSettings.version === appConfig.signalSettings.version
      ) {
        initSignalSettings = localStorage.signalSettings
      }
    }
  }
  const [signalSettings, setSignalSettings] =
    useState<SignalSettingsItem>(initSignalSettings)

  // Write values to localStorage on change
  useEffect(() => {
    setLocalStorage({
      chainIds,
      debug,
      currency,
      bookmarks,
      privacyPolicySlug,
      showPPC,
      infiniteApproval,
      signalSettings
    })
  }, [
    chainIds,
    debug,
    currency,
    bookmarks,
    privacyPolicySlug,
    showPPC,
    infiniteApproval,
    signalSettings
  ])
  const { signals } = signalSettings
  // Set ocean.js log levels, default: Error
  useEffect(() => {
    debug === true
      ? LoggerInstance.setLevel(LogLevel.Verbose)
      : LoggerInstance.setLevel(LogLevel.Error)
  }, [debug])

  // Get locale always from user's browser
  useEffect(() => {
    if (!window) return
    setLocale(window.navigator.language)
  }, [])
  function addSignalSetting(signalOriginItem: SignalOriginItem) {
    setSignalSettings((prevSignalSettings) => {
      const newSignalSettings = { ...prevSignalSettings }
      newSignalSettings.signals = [
        ...newSignalSettings.signals,
        signalOriginItem
      ]
      return { ...newSignalSettings }
    })
  }
  function removeSignalSetting(signalOriginItemId: string) {
    const newSignalSettings = { ...signalSettings }
    newSignalSettings.signals = newSignalSettings.signals.filter(
      (signalOriginItem) => signalOriginItem.id !== signalOriginItemId
    )
    setSignalSettings((prevSignalSettings) => {
      return { ...newSignalSettings }
    })
  }

  function updateSignalSetting(
    signalItem: SignalOriginItem,
    newSignalItem: SignalOriginItem
  ) {
    const newSignals = [...signalSettings.signals]
    const newSignalSettings = { ...signalSettings }
    const index = newSignals.indexOf(signalItem)
    if (index > -1) {
      // only splice array when item is found
      newSignals.splice(index, 1, newSignalItem) // 2nd parameter means remove one item only
    }
    newSignalSettings.signals = [...newSignals]
    setSignalSettings((prevSignalSettings) => {
      return { ...newSignalSettings }
    })
  }

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

  // chainIds old data migration
  // remove deprecated networks from user-saved chainIds
  useEffect(() => {
    if (!chainIds.includes(3) && !chainIds.includes(4)) return
    const newChainIds = chainIds.filter((id) => id !== 3 && id !== 4)
    setChainIds(newChainIds)
  }, [chainIds])

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
          showPPC,
          infiniteApproval,
          signals,
          addSignalSetting,
          removeSignalSetting,
          updateSignalSetting,
          setInfiniteApproval,
          setChainIds,
          setDebug,
          setCurrency,
          addBookmark,
          removeBookmark,
          setPrivacyPolicySlug,
          setShowPPC
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

export { UserPreferencesProvider, useUserPreferences }
