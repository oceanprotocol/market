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

export type NavigationState = {
  title: string
  url?: string | undefined
  items?: NavigationState[]
  icon?: any
  badge?: {
    color: string
    text: string | number
  }
  current: boolean
}

const initialState: NavigationState[] = [
  { title: 'item_6', url: '#', icon: UserCircle, current: false },
  { title: 'item_7', url: '#', icon: Wallet, current: false },
  { title: 'item_1', url: '#', icon: AlignBottom, current: true },
  { title: 'item_3', url: '#', icon: GridFour, current: false },
  { title: 'item_4', url: '#', icon: SuitcaseSimple, current: false },
  { title: 'item_2', url: '#', icon: FileText, current: false },
  { title: 'item_9', url: '#', icon: GraduationCap, current: false },
  { title: 'item_5', url: '#', icon: Support, current: false },
  { title: 'item_8', url: '#', icon: GearSix, current: false }
]

// Define the initial state using that type

export const navigationSlice = createSlice({
  name: 'navigation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {}
})

export default navigationSlice.reducer
