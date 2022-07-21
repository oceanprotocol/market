import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  AssetSignalItem,
  SignalOriginItem,
  SignalSettingsItem
} from '@context/Signals/_types'
import useSignalsLoader from '@hooks/useSignals'
import { useUserPreferences } from '@context/UserPreferences'
import { arrayEqual, getSignalUrls } from '@hooks/useSignals/_util'

export interface SignalsProviderValue {
  // We need to create variables that store the available assets and profiles for the relevant signals to then be fetched.
  userAddresses: string[]
  assetIds: string[]
  publisherIds: string[]
  signalUrls: string[]
  signals?: SignalOriginItem[]
  signalItems: AssetSignalItem[]
  loading: boolean
  // Settings provide data to work with locally and then also decide fetching based on user preferences
  settings?: SignalSettingsItem
  // // A method to update the current assetIds to use in signal queries
  setAssetIds(assets: string[]): void
  // setUserAddresses?(userAddresses: string[]): void
  // setPublisherIds?(queryUrls: string[]): void
  // setSignalUrls?(queryUrls: string[]): void
}

const refreshInterval = 120000 // 120 sec.

const SignalsContext = createContext({} as SignalsProviderValue)

function SignalsProvider({ children }: { children: ReactNode }): ReactElement {
  const [signalUrls, setSignalUrls] = useState<string[]>([])
  const [origin, setOrigin] = useState<string[]>(
    signalUrls[0] ? signalUrls : ['']
  )
  const { signals, addSignalSetting, removeSignalSetting } =
    useUserPreferences()

  // Using depsString method to resolve the array dependency issues when loading signalUrls array as a dependency
  // https://stackoverflow.com/questions/59467758/passing-array-to-useeffect-dependency-list
  const refSignals = useRef(signals)
  const refSignalUrls = useRef(signalUrls)
  if (!arrayEqual(signals, refSignals.current)) {
    refSignals.current = signals
  }
  if (!arrayEqual(signalUrls, refSignalUrls.current)) {
    refSignalUrls.current = signalUrls
  }
  // Based on current default signal settings set the signalURLs that will be used to fetch signals by a signal loader
  useEffect(() => {
    // Check if there's anything in the current default settings
    if (signals.length > 0) {
      const defaultSignalUrls: string[] = signals.map((signalOrigin) =>
        getSignalUrls(signalOrigin)
      )
      const compareUrl = new Set()
      refSignalUrls.current.forEach((signal, index) => {
        compareUrl.add(signal)
      })
      defaultSignalUrls.forEach((url) => {
        console.log(defaultSignalUrls)
        if (compareUrl.has(url)) return
        setSignalUrls((signalUrlArray) => {
          console.log([...signalUrlArray, url])
          return [...signalUrlArray, url]
        })
      })
    }
  }, [refSignals.current])
  useEffect(() => {
    console.log('useEffect to set origin')
    const compareUrl = new Set()
    refSignalUrls.current.forEach((signal, index) => {
      compareUrl.add(signal)
    })
    if (signalUrls.length > 0) {
      console.table(signalUrls)
      setOrigin(signalUrls)
    }
  }, [refSignalUrls.current])
  // we can use multiple useSignalsLoaders(origins) in the context based on the various queries that load assetIds
  // publisher ids, and user addresses at different times
  const {
    assetIds,
    setAssetIds,
    userAddresses,
    publisherIds,
    signalItems,
    loading
  } = useSignalsLoader(origin)

  return (
    <SignalsContext.Provider
      value={
        {
          userAddresses,
          assetIds,
          setAssetIds,
          signals,
          publisherIds,
          signalItems,
          signalUrls,
          loading
        } as SignalsProviderValue
      }
    >
      {children}
    </SignalsContext.Provider>
  )
}

const useSignal = (): SignalsProviderValue => useContext(SignalsContext)

export { SignalsProvider, useSignal, SignalsContext }
