import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssetList, { AssetListProps } from '@shared/AssetList'
import * as config from '../../../../app.config'
import { assets, locale } from '../../../../.storybook/__mockdata__'
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
  locale,
  assets,
  showPagination: false,
  chainIds: config.chainIds,
  accountId: '0x491AECC4b3d690a4D7027A385499fd04fE50b796'
}
