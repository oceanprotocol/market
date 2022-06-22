import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssetComputeList, {
  AssetComputeListProps
} from '@shared/AssetList/AssetComputeList'
import { assetSelectionAsset } from '../../../../../.storybook/__mockdata__'
import MarketMetadataProvider from '@context/MarketMetadata'

export default {
  title: 'Component/@shared/AssetList/AssetComputeList',
  component: AssetComputeList
} as ComponentMeta<typeof AssetComputeList>

const Template: ComponentStory<typeof AssetComputeList> = (
  args: AssetComputeListProps
) => {
  return (
    <MarketMetadataProvider>
      <AssetComputeList {...args} />
    </MarketMetadataProvider>
  )
}

interface Props {
  args: AssetComputeListProps
}

export const Default: Props = Template.bind({})
Default.args = {
  assets: assetSelectionAsset
}
