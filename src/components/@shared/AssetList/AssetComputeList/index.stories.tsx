import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssetComputeList, {
  AssetComputeListProps
} from '@shared/AssetList/AssetComputeList'
import {
  assetSelectionAsset,
  locale,
  prices
} from '../../../../../.storybook/__mockdata__'

export default {
  title: 'Component/@shared/AssetList/AssetComputeList',
  component: AssetComputeList
} as ComponentMeta<typeof AssetComputeList>

const Template: ComponentStory<typeof AssetComputeList> = (
  args: AssetComputeListProps
) => <AssetComputeList {...args} />

interface Props {
  args: AssetComputeListProps
}

export const Default: Props = Template.bind({})
Default.args = {
  assets: assetSelectionAsset
}
