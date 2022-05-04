import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tags from '@shared/atoms/Tags'
import styles from './index.module.css'

export default {
  title: 'Component/@shared/atoms/Tags',
  component: Tags
} as ComponentMeta<typeof Tags>

const Template: ComponentStory<typeof Tags> = (args) => <Tags {...args} />

interface Props {
  args: {
    items: string[]
    max: number
    className: string
    showMore: boolean
    noLinks: boolean
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  items: ['tag1', 'tag2', 'tag3'],
  max: 3,
  showMore: true,
  className: styles.tags || 'className',
  noLinks: true
}
