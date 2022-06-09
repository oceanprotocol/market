import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Markdown, { MarkdownProps } from '@shared/Markdown'

export default {
  title: 'Component/@shared/Markdown',
  component: Markdown
} as ComponentMeta<typeof Markdown>

const Template: ComponentStory<typeof Markdown> = (args: MarkdownProps) => (
  <Markdown {...args} />
)

interface Props {
  args: MarkdownProps
}

export const Default: Props = Template.bind({})
Default.args = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
}
