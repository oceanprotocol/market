import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Alert, { AlertProps } from '@shared/atoms/Alert'

export default {
  title: 'Component/@shared/atoms/Alert',
  component: Alert
} as ComponentMeta<typeof Alert>

const Template: ComponentStory<typeof Alert> = (args) => <Alert {...args} />

interface Props {
  args: AlertProps
}

export const Default: Props = Template.bind({})
Default.args = {
  text: 'Alert text',
  state: 'info',
  onDismiss: () => console.log('Alert closed!')
}

export const Full: Props = Template.bind({})
Full.args = {
  title: 'Alert',
  text: 'Alert text',
  state: 'info',
  action: {
    name: 'Action',
    handleAction: () => null as any
  },
  badge: 'Hello',
  onDismiss: () => {
    console.log('Alert closed!')
  }
}
