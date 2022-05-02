import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ListItem } from '@shared/atoms/Lists/index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Lists',
  component: ListItem
} as ComponentMeta<typeof ListItem>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ListItem> = (args) => (
  <ListItem {...args} />
)

interface Props {
  args: {
    children: any
    ol: boolean
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  children: 'Button',
  ol: true
}
