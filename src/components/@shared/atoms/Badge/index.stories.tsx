import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Badge from '@shared/atoms/Badge'
import styles from './index.module.css'

export default {
  title: 'Component/@shared/atoms/Badge',
  component: Badge
} as ComponentMeta<typeof Badge>

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />

interface Props {
  args: {
    label: string
    className: string
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  label: 'Badge label',
  className: styles.badge || 'className'
}
