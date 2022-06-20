import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssetList, { AssetListProps } from '@shared/AssetList'
import * as config from '../../../../app.config'
import {
  assets,
  locale,
  mockWallet,
  prices
} from '../../../../.storybook/__mockdata__'
import UrqlClientProvider from '@context/UrqlProvider'

export default {
  title: 'Component/@shared/AssetList',
  component: AssetList
} as ComponentMeta<typeof AssetList>

const Template: ComponentStory<typeof AssetList> = (args: AssetListProps) => {
  return (
    <UrqlClientProvider>
      <AssetList {...args} />
    </UrqlClientProvider>
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
