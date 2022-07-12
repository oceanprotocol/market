import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Status, { StatusProps } from '@shared/atoms/Status'

export default {
  title: 'Component/@shared/atoms/Status',
  component: Status
} as ComponentMeta<typeof Status>

const Template: ComponentStory<typeof Status> = (args) => <Status {...args} />

interface Props {
  args: StatusProps
}

export const Default: Props = Template.bind({})
Default.args = {}

export const Warning: Props = Template.bind({})
Warning.args = {
  state: 'warning'
}

export const Error: Props = Template.bind({})
Error.args = {
  state: 'error'
}
