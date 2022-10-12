import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TippyProps } from '@tippyjs/react'
import Tooltip from '@shared/atoms/Tooltip'
import {
  args,
  argsDisabled,
  argsWithContentOpened,
  argsWithCustomTriggerElement,
  argsWithCustomTriggerEvent
} from './index.test'

export default {
  title: 'Component/@shared/atoms/Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />

interface Props {
  args: TippyProps
}

export const Default: Props = Template.bind({})
Default.args = args

export const WithContentOpened: Props = Template.bind({})
WithContentOpened.args = argsWithContentOpened

export const WithCustomTriggerElement: Props = Template.bind({})
WithCustomTriggerElement.args = argsWithCustomTriggerElement

export const WithCustomTriggerEvent: Props = Template.bind({})
WithCustomTriggerEvent.args = argsWithCustomTriggerEvent

export const Disabled: Props = Template.bind({})
Disabled.args = argsDisabled
