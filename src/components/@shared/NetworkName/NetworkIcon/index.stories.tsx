import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { NetworkIcon, NetworkIconProps } from '@shared/NetworkName/NetworkIcon'

export default {
  title: 'Component/@shared/NetworkIcon',
  component: NetworkIcon
} as ComponentMeta<typeof NetworkIcon>

const Template: ComponentStory<typeof NetworkIcon> = (
  args: NetworkIconProps
) => <NetworkIcon {...args} />

interface Props {
  args: NetworkIconProps
}

export const Default: Props = Template.bind({})
Default.args = {
  name: 'Polygon'
}
