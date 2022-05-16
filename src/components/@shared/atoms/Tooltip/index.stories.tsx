import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tooltip, { TooltipProps } from '@shared/atoms/Tooltip'

export default {
  title: 'Component/@shared/atoms/Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />

interface Props {
  args: TooltipProps
}

export const Default: Props = Template.bind({})
Default.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.'
}

export const WithChildren: Props = Template.bind({})
WithChildren.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.',
  children: (
    <>
      <a>Tooltip child</a>
    </>
  )
}

export const WithTrigger: Props = Template.bind({})
WithTrigger.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.',
  children: (
    <>
      <a>Click here</a>
    </>
  ),
  trigger: 'on click'
}

export const Disabled: Props = Template.bind({})
Disabled.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie.',
  children: (
    <>
      <a>Tooltip disabled</a>
    </>
  ),
  disabled: true
}
