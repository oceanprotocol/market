import { createSlice } from '@reduxjs/toolkit'

import {
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

export type CategoryItem = {
  title: string
  url?: string | undefined
  items?: CategoriesState[]
  icon?: any
  current?: boolean
  badge?: {
    color: string
    text: string | number
  }
}

export type CategoriesState = {
  [key: string]: CategoryItem[]
  discover: CategoryItem[]
}

const initialState: CategoriesState = {
  discover: [
    { title: 'All', url: '', icon: SwitchVertical, current: true },
    { title: 'Business', url: '', icon: Briefcase },
    { title: 'Demographics', url: '', icon: Users },
    { title: 'Financial', url: '', icon: CurrencyDollar },
    { title: 'Government', url: '', icon: Library },
    { title: 'Health', url: '', icon: Heart },
    { title: 'Local', url: '', icon: LocationMarker },
    { title: 'Marketing', url: '', icon: Speakerphone },
    { title: 'Security', url: '', icon: LockClosed },
    { title: 'Travel', url: '', icon: PaperAirplane },
    { title: 'Weather', url: '', icon: Sun }
  ]
}

// Define the initial state using that type

export const categoriesSlice = createSlice({
  name: 'categories',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {}
})

export default categoriesSlice.reducer
