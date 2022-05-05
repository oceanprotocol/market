import React, { ReactNode } from 'react'
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
    children: ReactNode
    ol: boolean
  }
}

export const Primary: Props = Template.bind({})
Primary.args = {
  children: (
    <>
      <a href="https://oceanprotocol.com/" target="_blank" rel="noreferrer">
        List Item
      </a>
    </>
  ),
  ol: true
}
