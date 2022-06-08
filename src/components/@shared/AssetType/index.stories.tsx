import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssetType, { AssetTypeProps } from '@shared/AssetType'

export default {
  title: 'Component/@shared/AssetType',
  component: AssetType
} as ComponentMeta<typeof AssetType>

const Template: ComponentStory<typeof AssetType> = (args: AssetTypeProps) => (
  <AssetType {...args} />
)

interface Props {
  args: AssetTypeProps
}

export const Dataset: Props = Template.bind({})
Dataset.args = {
  type: 'dataset',
  accessType: 'access'
}

export const Algorithm: Props = Template.bind({})
Algorithm.args = {
  type: 'algorithm',
  accessType: 'compute'
}
