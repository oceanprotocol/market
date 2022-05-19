import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TippyProps } from '@tippyjs/react'
import Tooltip from '@shared/atoms/Tooltip'

export default {
  title: 'Component/@shared/atoms/Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />

interface Props {
  args: TippyProps
}

export const Default: Props = Template.bind({})
Default.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.'
}

export const WithContentOpened: Props = Template.bind({})
WithContentOpened.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.',
  showOnCreate: true
}

export const WithCustomTriggerElement: Props = Template.bind({})
WithCustomTriggerElement.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.',
  children: <a>Tooltip trigger</a>
}

export const WithCustomTriggerEvent: Props = Template.bind({})
WithCustomTriggerEvent.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.',
  children: <button>Click here</button>,
  trigger: 'on click'
}

export const Disabled: Props = Template.bind({})
Disabled.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.',
  children: <a>Tooltip disabled</a>,
  disabled: true
}
