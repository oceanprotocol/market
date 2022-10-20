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
  GraduationCap,
  SwitchVertical,
  Briefcase,
  Users,
  CurrencyDollar,
  Library,
  Heart,
  LocationMarker,
  Speakerphone,
  LockClosed,
  PaperAirplane,
  Sun
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
  current: boolean
}

export type NavigationState = {
  main: NavigationItem[]
  user: NavigationItem[]
  category: NavigationItem[]
}

const initialState: NavigationState = {
  main: [
    { title: 'item_6', url: '#', icon: UserCircle, current: false },
    { title: 'item_7', url: '#', icon: Wallet, current: false },
    { title: 'item_1', url: '#', icon: AlignBottom, current: true },
    { title: 'item_3', url: '#', icon: GridFour, current: false },
    { title: 'item_4', url: '#', icon: SuitcaseSimple, current: false },
    { title: 'item_2', url: '#', icon: FileText, current: false },
    { title: 'item_9', url: '#', icon: GraduationCap, current: false },
    { title: 'item_5', url: '#', icon: Support, current: false },
    { title: 'item_8', url: '#', icon: GearSix, current: false }
  ],
  user: [
    { title: 'Your Profile', url: '#', current: false },
    { title: 'Settings', url: '#', current: false },
    { title: 'Sign out', url: '#', current: true }
  ],
  category: [
    { title: 'All', url: '#', icon: SwitchVertical, current: false },
    { title: 'Business', url: '#', icon: Briefcase, current: false },
    { title: 'Demographics', url: '#', icon: Users, current: true },
    { title: 'Financial', url: '#', icon: CurrencyDollar, current: false },
    { title: 'Government', url: '#', icon: Library, current: false },
    { title: 'Health', url: '#', icon: Heart, current: false },
    { title: 'Local', url: '#', icon: LocationMarker, current: false },
    { title: 'Marketing', url: '#', icon: Speakerphone, current: false },
    { title: 'Security', url: '#', icon: LockClosed, current: false },
    { title: 'Travel', url: '#', icon: PaperAirplane, current: false },
    { title: 'Weather', url: '#', icon: Sun, current: false }
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
