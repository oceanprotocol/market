import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import DebugOutput, { DebugOutputProps } from '@shared/DebugOutput'

export default {
  title: 'Component/@shared/DebugOutput',
  component: DebugOutput
} as ComponentMeta<typeof DebugOutput>

const Template: ComponentStory<typeof DebugOutput> = (
  args: DebugOutputProps
) => <DebugOutput {...args} />

interface Props {
  args: DebugOutputProps
}

export const Default: Props = Template.bind({})
Default.args = {
  output: <p>Your Debug Data </p>
}

export const WithTitle: Props = Template.bind({})
WithTitle.args = {
  title: 'Debug Data',
  output: <p>Your Debug Data </p>
}
