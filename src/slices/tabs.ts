import { createSlice } from '@reduxjs/toolkit'

import {
  AlignBottom,
  FileText,
  GridFour,
  SuitcaseSimple,
  Support,
  UserCircle,
  Wallet,
  GearSix,
  GraduationCap
} from '../assets/images/icons'

export type TabsItem = {
  title: string
  url?: string | undefined
  items?: TabsItem[]
  icon?: any
  badge?: {
    color: string
    text: string | number
  }
  current: boolean
}

export type TabsState = {
  discover: TabsItem[]
}

const initialState: TabsState = {
  discover: [
    { title: 'Listings', url: '#', current: true },
    { title: 'Request', url: '#', current: false }
  ]
}

// Define the initial state using that type

export const tabsSlice = createSlice({
  name: 'tabs',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {}
})

export default tabsSlice.reducer
