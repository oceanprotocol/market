import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AddToken, { AddTokenProps } from '@shared/AddToken'

export default {
  title: 'Component/@shared/AddToken',
  component: AddToken
} as ComponentMeta<typeof AddToken>

const Template: ComponentStory<typeof AddToken> = (args: AddTokenProps) => {
  return <AddToken {...args} />
}

interface Props {
  args: AddTokenProps
}

export const Default: Props = Template.bind({})
Default.args = {
  address: '0xd8992Ed72C445c35Cb4A2be468568Ed1079357c8',
  symbol: 'OCEAN'
}

export const Minimal: Props = Template.bind({})
Minimal.args = {
  address: '0xd8992Ed72C445c35Cb4A2be468568Ed1079357c8',
  symbol: 'OCEAN',
  minimal: true
}
