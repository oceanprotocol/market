import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ListItem } from '@shared/atoms/Lists'

export default {
  title: 'Component/@shared/atoms/Lists',
  component: ListItem
} as ComponentMeta<typeof ListItem>

const Template: ComponentStory<typeof ListItem> = (args) => (
  <ListItem {...args} />
)

interface Props {
  args: {
    // children: any
    ol: boolean
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  // children: 'Button',
  ol: true
}
