import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Logo from '@shared/atoms/Logo'

export default {
  title: 'Component/@shared/atoms/Logo',
  component: Logo
} as ComponentMeta<typeof Logo>

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />

interface Props {
  args: {
    noWordmark: boolean
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  noWordmark: true
}
