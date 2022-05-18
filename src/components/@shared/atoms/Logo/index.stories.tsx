import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Logo, { LogoProps } from '@shared/atoms/Logo'

export default {
  title: 'Component/@shared/atoms/Logo',
  component: Logo
} as ComponentMeta<typeof Logo>

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />

interface Props {
  args: LogoProps
}

export const Primary: Props = Template.bind({})
Primary.args = {
  noWordmark: true
}
