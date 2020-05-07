import React from 'react'
import SearchFilterSection from './SearchFilterSection'
import { Center } from '../../../.storybook/helpers'

export default {
  title: 'Atoms/SearchFilterSection',
  decorators: [(storyFn: any) => <Center>{storyFn()}</Center>]
}

export const WithTitle = () => {
  return (
    <SearchFilterSection title="Search filter title">
      <p>Example search filter content, in this case a paragraph.</p>
    </SearchFilterSection>
  )
}

export const WithoutTitle = () => {
  return (
    <SearchFilterSection>
      <p>Example search filter content, in this case a paragraph.</p>
    </SearchFilterSection>
  )
}
