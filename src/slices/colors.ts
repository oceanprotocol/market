import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
type ColorsState = string[]

// Define the initial state using that type
const initialState: ColorsState = [
  'transparent',
  'black',
  'white',
  'gray',
  'red',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
  'pink'
]

export const colorsSlice = createSlice({
  name: 'colors',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {}
})

export default colorsSlice.reducer
