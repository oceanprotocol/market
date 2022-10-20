import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import colorsReducer from './slices/colors'
import configReducer from './slices/config'
import navigationReducer from './slices/navigation'
import tabsReducer from './slices/tabs'

const store = configureStore({
  reducer: {
    colors: colorsReducer,
    config: configReducer,
    navigation: navigationReducer,
    tabs: tabsReducer
  }
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
