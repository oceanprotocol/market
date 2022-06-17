import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssetSelection, {
  AssetSelectionProps
} from '@shared/FormFields/AssetSelection'
import {
  assetSelectionAsset,
  locale,
  prices
} from '../../../../../.storybook/__mockdata__'

export default {
  title: 'Component/@shared/FormFields/AssetSelection',
  component: AssetSelection
} as ComponentMeta<typeof AssetSelection>

const Template: ComponentStory<typeof AssetSelection> = (
  args: AssetSelectionProps
) => <AssetSelection {...args} />

interface Props {
  args: AssetSelectionProps
}

export const Default: Props = Template.bind({})
Default.args = {
  assets: assetSelectionAsset,
  currency: 'OCEAN',
  prices
}

export const Multiple: Props = Template.bind({})
Multiple.args = {
  assets: assetSelectionAsset,
  multiple: true,
  currency: 'OCEAN',
  prices
}

export const Disabled: Props = Template.bind({})
Disabled.args = {
  assets: assetSelectionAsset,
  disabled: true,
  currency: 'OCEAN',
  prices
}
