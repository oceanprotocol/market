import { createSlice } from '@reduxjs/toolkit'

export type TabsItem = {
  title: string
  url?: string | undefined
  items?: TabsItem[]
  icon?: any
  current?: boolean
  badge?: {
    color: string
    text: string | number
  }
}

export type TabsState = {
  [key: string]: TabsItem[]
  discover: TabsItem[]
}

const initialState: TabsState = {
  discover: [
    { title: 'Listings', url: 'listings', current: true },
    { title: 'Request', url: 'request' }
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
