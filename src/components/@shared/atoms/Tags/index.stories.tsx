import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tags from '@shared/atoms/Tags/index'
import styles from './index.module.css'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Tags',
  component: Tags
} as ComponentMeta<typeof Tags>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
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
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  items: ['tag1', 'tag2', 'tag3'],
  max: 3,
  showMore: true,
  className: styles.tags || 'className',
  noLinks: true
}
