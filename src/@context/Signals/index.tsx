import React, { createContext, useContext } from 'react'
import { SignalOriginItem } from '@context/Signals/_types'

export interface SignalsProviderValue {
  title: string
  signalOriginList: SignalOriginItem[]
  error?: string
  loading: boolean
}

const SignalsContext = createContext({} as SignalsProviderValue)

const useSignal = (): SignalsProviderValue => useContext(SignalsContext)

export { useSignal, SignalsContext }
