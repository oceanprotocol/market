import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import NetworkName, { NetworkNameProps } from '@shared/NetworkName'

export default {
  title: 'Component/@shared/NetworkName',
  component: NetworkName
} as ComponentMeta<typeof NetworkName>

const Template: ComponentStory<typeof NetworkName> = (
  args: NetworkNameProps
) => <NetworkName {...args} />

interface Props {
  args: NetworkNameProps
}

export const Default: Props = Template.bind({})
Default.args = {
  networkId: 1287
}

export const Minimal: Props = Template.bind({})
Minimal.args = {
  networkId: 1287,
  minimal: true
}
