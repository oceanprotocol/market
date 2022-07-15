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
  SignalItem,
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
  signals: SignalItem[]
  loading: boolean
  // Settings provide data to work with locally and then also decide fetching based on user preferences
  settings?: SignalSettingsItem
  // Signals stored here based on settings and any changes to signal settings
  defaultSignals: SignalOriginItem[]
  customSignals: SignalOriginItem[]
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
  const [origin, setOrigin] = useState<string>(
    `${signalUrls[0] ? signalUrls[0] : ''}`
  )
  const {
    defaultSignals,
    customSignals,
    addCustomSignalSetting,
    removeCustomSignalSetting
  } = useUserPreferences()
  const refDefaultSignals = useRef(defaultSignals)
  const refSignalUrls = useRef(signalUrls)
  useEffect(() => {
    const urlsHash: { [key: string]: string } = {}
    signalUrls.forEach((url) => {
      urlsHash[url] = url
    })
    if (defaultSignals.length > 0) {
      const defaultSignalUrls: string[] = defaultSignals.map((signalOrigin) =>
        getSignalUrls(signalOrigin)
      )

      defaultSignalUrls.forEach((url) => {
        console.log(defaultSignalUrls)
        if (urlsHash[url]) return
        setSignalUrls((signalUrlArray) => {
          console.log([...signalUrlArray, url])
          return [...signalUrlArray, url]
        })
      })
    }
    // if (customSignals.length > 0) {
    //   const customSignalUrls: string[] = customSignals.map((signalOrigin) =>
    //     getSignalUrls(signalOrigin)
    //   )
    //   console.count('setup signal urls based on settings')
    //   const newSignalUrls = [...signalUrls, ...customSignalUrls]
    //   setSignalUrls(newSignalUrls)
    // }
  }, [defaultSignals])
  // Using depsString method to resolve the array dependency issues when loading signalUrls array as a dependency
  // https://stackoverflow.com/questions/59467758/passing-array-to-useeffect-dependency-list
  useEffect(() => {
    if (signalUrls.length > 0 && (!origin || origin === '')) {
      console.table(signalUrls)
      setOrigin(`${signalUrls[0]}`)
    }
  }, [refSignalUrls.current])
  // check useRef array is same as signalsUrls array and update if not
  if (!arrayEqual(signalUrls, refSignalUrls.current)) {
    refSignalUrls.current = signalUrls
  }
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
          publisherIds,
          signals: signalItems,
          defaultSignals: [],
          customSignals: [],
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
