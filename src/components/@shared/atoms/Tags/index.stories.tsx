import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Tags, { TagsProps } from './'
import {
  args,
  argsMaxNumberOfTags,
  argsShowMore,
  argsWithoutLinks
} from './index.test'

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
