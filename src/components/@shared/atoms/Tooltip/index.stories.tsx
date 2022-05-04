import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tooltip from '@shared/atoms/Tooltip/index'
import styles from './index.module.css'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />

interface Props {
  args: {
    content: any
    children: any
    trigger: string
    disabled: boolean
    className: string
    //   placement: Placement
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  content: 'Toltip test content',
  children: 'Button',
  trigger: 'tooltip trigger',
  className: styles.tooltip || 'className',
  disabled: true
}
