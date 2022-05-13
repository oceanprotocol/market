import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Loader, { LoaderProps } from '@shared/atoms/Loader'

export default {
  title: 'Component/@shared/atoms/Loader',
  component: Loader
} as ComponentMeta<typeof Loader>

const Template: ComponentStory<typeof Loader> = (args) => <Loader {...args} />

interface Props {
  args: LoaderProps
}

export const Default: Props = Template.bind({})
Default.args = {}

export const WithMessage: Props = Template.bind({})
WithMessage.args = {
  message: 'Loading...'
}
