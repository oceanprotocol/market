import React from 'react'
import SearchBar from './SearchBar'
import { Center } from '../../../.storybook/helpers'

export default {
  title: 'Molecules/SearchBar',
  decorators: [(storyFn: any) => <Center>{storyFn()}</Center>]
}

export const Normal = () => <SearchBar />

export const WithInitialValue = () => <SearchBar initialValue="Water" />

export const WithFilters = () => <SearchBar filters />
