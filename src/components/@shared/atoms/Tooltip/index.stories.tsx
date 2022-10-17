import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TippyProps } from '@tippyjs/react'
import Tooltip from '@shared/atoms/Tooltip'

export const props: TippyProps = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.'
}

export const propsWithContentOpened: TippyProps = {
  content: props.content,
  showOnCreate: true
}

export const propsWithCustomTriggerElement: TippyProps = {
  content: props.content,
  children: <a>Tooltip trigger</a>
}

export const propsWithCustomTriggerEvent: TippyProps = {
  content: props.content,
  children: <button>Click here</button>,
  trigger: 'on click'
}

export const propsDisabled: TippyProps = {
  content: props.content,
  children: <a>Tooltip disabled</a>,
  disabled: true
}

export default {
  title: 'Component/@shared/atoms/Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />

interface Props {
  args: TippyProps
}

export const Default: Props = Template.bind({})
Default.args = props

export const WithContentOpened: Props = Template.bind({})
WithContentOpened.args = propsWithContentOpened

export const WithCustomTriggerElement: Props = Template.bind({})
WithCustomTriggerElement.args = propsWithCustomTriggerElement

export const WithCustomTriggerEvent: Props = Template.bind({})
WithCustomTriggerEvent.args = propsWithCustomTriggerEvent

export const Disabled: Props = Template.bind({})
Disabled.args = propsDisabled
