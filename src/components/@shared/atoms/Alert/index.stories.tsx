import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Alert from '@shared/atoms/Alert'

export default {
  title: 'Component/@shared/atoms/Alert',
  component: Alert
} as ComponentMeta<typeof Alert>

const Template: ComponentStory<typeof Alert> = (args) => <Alert {...args} />

interface Props {
  args: {
    title: string
    text: string
    state: string
    onDismiss: any
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  title: 'An alert title',
  text: 'An alert text',
  state: 'error',
  onDismiss: () => {
    console.log('Alert dismissed')
  }
}
