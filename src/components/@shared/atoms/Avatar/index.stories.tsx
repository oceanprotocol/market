import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Avatar, { AvatarProps } from '@shared/atoms/Avatar'

export default {
  title: 'Component/@shared/atoms/Avatar',
  component: Avatar
} as ComponentMeta<typeof Avatar>

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />

interface Props {
  args: AvatarProps
}

export const DefaultWithBlockies: Props = Template.bind({})
DefaultWithBlockies.args = {
  accountId: '0x1234567890123456789012345678901234567890'
}

export const CustomSource: Props = Template.bind({})
CustomSource.args = {
  accountId: '0x1234567890123456789012345678901234567890',
  src: 'http://placekitten.com/g/300/300'
}

export const Empty: Props = Template.bind({})
Empty.args = {
  accountId: null
}
