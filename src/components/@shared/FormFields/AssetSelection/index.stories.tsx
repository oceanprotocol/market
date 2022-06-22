import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssetSelection, {
  AssetSelectionProps
} from '@shared/FormFields/AssetSelection'
import { assetSelectionAsset } from '../../../../../.storybook/__mockdata__'
import MarketMetadataProvider from '@context/MarketMetadata'
import { UserPreferencesProvider } from '@context/UserPreferences'

export default {
  title: 'Component/@shared/FormFields/AssetSelection',
  component: AssetSelection
} as ComponentMeta<typeof AssetSelection>

const Template: ComponentStory<typeof AssetSelection> = (
  args: AssetSelectionProps
) => {
  return (
    <MarketMetadataProvider>
      <UserPreferencesProvider>
        <AssetSelection {...args} />
      </UserPreferencesProvider>
    </MarketMetadataProvider>
  )
}
interface Props {
  args: AssetSelectionProps
}

export const Default: Props = Template.bind({})
Default.args = {
  assets: assetSelectionAsset
}

export const Multiple: Props = Template.bind({})
Multiple.args = {
  assets: assetSelectionAsset,
  multiple: true
}

export const Disabled: Props = Template.bind({})
Disabled.args = {
  assets: assetSelectionAsset,
  disabled: true
}
