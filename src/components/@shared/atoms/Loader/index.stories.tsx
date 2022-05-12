import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Loader from '@shared/atoms/Loader'

export default {
  title: 'Component/@shared/atoms/Loader',
  component: Loader
} as ComponentMeta<typeof Loader>

const Template: ComponentStory<typeof Loader> = (args) => <Loader {...args} />

interface Props {
  args: {
    message: string
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  message: 'Loading...'
}
