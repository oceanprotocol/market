import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import MarketMetadataProvider from '@context/MarketMetadata'
import { UserPreferencesProvider } from '@context/UserPreferences'
import AssetList, { AssetListProps } from '.'
import { assets } from '../../../../.jest/__fixtures__/datasetsWithAccessDetails'

export default {
  title: 'Component/@shared/AssetList',
  component: AssetList
} as ComponentMeta<typeof AssetList>

const Template: ComponentStory<typeof AssetList> = (args: AssetListProps) => {
  return (
    <MarketMetadataProvider>
      <UserPreferencesProvider>
        <AssetList {...args} />
      </UserPreferencesProvider>
    </MarketMetadataProvider>
  )
}

export const Default: { args: AssetListProps } = Template.bind({})
Default.args = {
  assets,
  showPagination: true,
  page: 1,
  totalPages: 10
}

export const Empty: { args: AssetListProps } = Template.bind({})
Empty.args = {
  assets: [],
  showPagination: false
}
