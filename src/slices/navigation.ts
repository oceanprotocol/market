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

export type NavigationItem = {
  title: string
  url?: string | undefined
  items?: NavigationState[]
  icon?: any
  badge?: {
    color: string
    text: string | number
  }
}

export type NavigationState = {
  main: NavigationItem[]
  user: NavigationItem[]
}

const initialState: NavigationState = {
  main: [
    { title: 'item_6', url: '/', icon: UserCircle },
    { title: 'item_7', url: '/empty-page', icon: Wallet },
    { title: 'item_1', url: '/discover', icon: AlignBottom },
    { title: 'item_3', url: '/empty-page', icon: GridFour },
    {
      title: 'item_4',
      url: '/empty-page',
      icon: SuitcaseSimple
    },
    { title: 'item_2', url: '/empty-page', icon: FileText },
    {
      title: 'item_9',
      url: '/empty-page',
      icon: GraduationCap
    },
    { title: 'item_5', url: '/empty-page', icon: Support },
    { title: 'item_8', url: '/empty-page', icon: GearSix }
  ],
  user: [
    { title: 'Your Profile', url: '#' },
    { title: 'Settings', url: '#' },
    { title: 'Sign out', url: '#' }
  ]
}

// Define the initial state using that type

export const navigationSlice = createSlice({
  name: 'navigation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {}
})

export default navigationSlice.reducer
