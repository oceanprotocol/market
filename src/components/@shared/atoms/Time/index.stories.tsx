import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Time from '@shared/atoms/Time'

export default {
  title: 'Component/@shared/atoms/Time',
  component: Time
} as ComponentMeta<typeof Time>

const Template: ComponentStory<typeof Time> = (args) => <Time {...args} />

interface Props {
  args: {
    date: string
    relative: boolean
    isUnix: boolean
    displayFormat: string
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  date: '2022-05-02T11:50:28.000Z',
  relative: true,
  isUnix: false,
  displayFormat: 'PP'
}
