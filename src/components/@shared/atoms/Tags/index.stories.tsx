import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Tags, { TagsProps } from './'

export const args: TagsProps = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  className: 'custom-class'
}

export const argsMaxNumberOfTags: TagsProps = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  max: 2
}

export const argsShowMore: TagsProps = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  max: 2,
  showMore: true
}

export const argsWithoutLinks: TagsProps = {
  items: [' tag1 ', ' tag2 ', ' tag3 '],
  noLinks: true
}

export default {
  title: 'Component/@shared/atoms/Tags',
  component: Tags
} as ComponentMeta<typeof Tags>

const Template: ComponentStory<typeof Tags> = (args) => <Tags {...args} />

interface Props {
  args: TagsProps
}

export const Default: Props = Template.bind({})
Default.args = args

export const MaxNumberOfTags: Props = Template.bind({})
MaxNumberOfTags.args = argsMaxNumberOfTags

export const ShowMore: Props = Template.bind({})
ShowMore.args = argsShowMore

export const WithoutLinks: Props = Template.bind({})
WithoutLinks.args = argsWithoutLinks
