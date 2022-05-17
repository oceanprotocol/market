import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tags, { TagsProps } from '@shared/atoms/Tags'
import styles from './index.module.css'

export default {
  title: 'Component/@shared/atoms/Tags',
  component: Tags
} as ComponentMeta<typeof Tags>

const Template: ComponentStory<typeof Tags> = (args) => <Tags {...args} />

interface Props {
  args: TagsProps
}

export const Default: Props = Template.bind({})
Default.args = {
  items: [' tag1 ', ' tag2 ', ' tag3 ']
}

export const MaxNumberOfTags: Props = Template.bind({})
MaxNumberOfTags.args = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  max: 2
}

export const ShowMore: Props = Template.bind({})
ShowMore.args = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  max: 2,
  showMore: true
}

export const WithoutLinks: Props = Template.bind({})
WithoutLinks.args = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  noLinks: true
}