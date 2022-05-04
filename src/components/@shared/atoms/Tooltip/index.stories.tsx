import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tooltip from '@shared/atoms/Tooltip'
import styles from './index.module.css'

export default {
  title: 'Component/@shared/atoms/Tooltip',
  component: Tooltip
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />

interface Props {
  args: {
    content: any
    // children: any
    trigger: string
    disabled: boolean
    className: string
    //   placement: Placement
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  content: 'Toltip test content',
  // children: 'Button',
  trigger: 'tooltip trigger',
  className: styles.tooltip || 'className',
  disabled: true
}
