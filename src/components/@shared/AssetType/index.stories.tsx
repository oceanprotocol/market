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

export const Default: Props = Template.bind({})
Default.args = {
  type: 'compute',
  accessType: 'access'
}
