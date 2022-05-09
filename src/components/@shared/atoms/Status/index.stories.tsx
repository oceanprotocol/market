import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Status from '@shared/atoms/Status'

export default {
  title: 'Component/@shared/atoms/Status',
  component: Status
} as ComponentMeta<typeof Status>

const Template: ComponentStory<typeof Status> = (args) => <Status {...args} />

interface Props {
  args: {
    state: string
    className?: string
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  state: 'warning'
}
