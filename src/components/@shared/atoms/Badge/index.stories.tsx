import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Badge from '@shared/atoms/Badge/index'
import styles from './index.module.css'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Blockies',
  component: Badge
} as ComponentMeta<typeof Badge>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />

interface Props {
  args: {
    label: string
    className: string
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  label: 'Badge label',
  className: styles.badge || 'className'
}
