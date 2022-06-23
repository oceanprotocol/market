import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssetList, { AssetListProps } from '@shared/AssetList'
import * as config from '../../../../app.config'
import { assets, mockWallet } from '../../../../.storybook/__mockdata__'
import UrqlClientProvider from '@context/UrqlProvider'
import { UserPreferencesProvider } from '@context/UserPreferences'
import MarketMetadataProvider from '@context/MarketMetadata'

export default {
  title: 'Component/@shared/AssetList',
  component: AssetList
} as ComponentMeta<typeof AssetList>

const Template: ComponentStory<typeof AssetList> = (args: AssetListProps) => {
  return (
    <MarketMetadataProvider>
      <UrqlClientProvider>
        <UserPreferencesProvider>
          <AssetList {...args} />
        </UserPreferencesProvider>
      </UrqlClientProvider>
    </MarketMetadataProvider>
  )
}

interface Props {
  args: AssetListProps
}

export const Default: Props = Template.bind({})
Default.args = {
  assets,
  showPagination: false,
  chainIds: config.chainIds,
  accountId: mockWallet
}
