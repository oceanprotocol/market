import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Alert from '@shared/atoms/Alert'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Alert',
  component: Alert
} as ComponentMeta<typeof Alert>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
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
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: 'An alert title',
  text: 'An alert text',
  state: 'error',
  onDismiss: () => {
    console.log('Alert dismissed')
  }
}
