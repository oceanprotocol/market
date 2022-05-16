import React, { ReactNode } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ListItem, ListItemProps } from '@shared/atoms/Lists'

export default {
  title: 'Component/@shared/atoms/Lists',
  component: ListItem
} as ComponentMeta<typeof ListItem>

const Template: ComponentStory<typeof ListItem> = (args) => (
  <ListItem {...args} />
)

interface Props {
  args: ListItemProps
}

export const Default: Props = Template.bind({})
Default.args = {
  children: (
    <>
      <a>List Item</a>
    </>
  )
}

export const OrderedListItem: Props = Template.bind({})
OrderedListItem.args = {
  children: (
    <>
      <a
        href="https://docs.oceanprotocol.com/"
        target="_blank"
        rel="noreferrer"
      >
        Ordered list item
      </a>
    </>
  ),
  ol: true
}
