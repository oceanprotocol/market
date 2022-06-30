import React, { createContext, useContext } from 'react'
import { SignalOriginItem } from '@context/Signals/_types'

export interface SignalsProviderValue {
  origins: string[]
  settings: {}
  signalOriginList: SignalOriginItem[]
  usDetailSignal: () => void
  useListSignals: () => void
  useAddSignal: () => void
  useRemoveSignal: () => void
  error?: string
  loading: boolean
}

const SignalsContext = createContext({} as SignalsProviderValue)

const useSignal = (): SignalsProviderValue => useContext(SignalsContext)

export { useSignal, SignalsContext }
