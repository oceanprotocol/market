import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Time, { TimeProps } from '@shared/atoms/Time'

export default {
  title: 'Component/@shared/atoms/Time',
  component: Time
} as ComponentMeta<typeof Time>

const Template: ComponentStory<typeof Time> = (args) => <Time {...args} />

interface Props {
  args: TimeProps
}

export const Default: Props = Template.bind({})
Default.args = {
  date: '2022-05-02T11:50:28.000Z'
}

export const Relative: Props = Template.bind({})
Relative.args = {
  date: '2022-05-02T11:50:28.000Z',
  relative: true
}

export const IsUnix: Props = Template.bind({})
IsUnix.args = {
  date: '1652448367',
  isUnix: true
}

export const Undefined: Props = Template.bind({})
Undefined.args = {
  date: null
}
