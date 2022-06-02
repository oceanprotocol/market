import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssetSelection, {
  AssetSelectionProps
} from '@shared/FormFields/AssetSelection'

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

const assetsList = [
  {
    did: 'did:op:07baafad66d21e61789d2d71ee1684c2d7235f8efefc59bfabf4fd984bf5c09d',
    name: 'Pool test',
    price: '22.004619932610114622',
    checked: true,
    symbol: 'OCEAN-NFT'
  },
  {
    did: 'did:op:3f0f273e030e38fa24d5c725bb73fc799cc424847e05bc064ff63813d30fae36',
    name: 'Dynamic price test',
    price: '11.103104637669568064',
    checked: true,
    symbol: 'PUCPOR-86'
  }
]

export const Default: Props = Template.bind({})
Default.args = {
  assets: assetsList
}

export const Multiple: Props = Template.bind({})
Multiple.args = {
  assets: assetsList,
  multiple: true
}

export const Disabled: Props = Template.bind({})
Disabled.args = {
  assets: assetsList,
  disabled: true
}
