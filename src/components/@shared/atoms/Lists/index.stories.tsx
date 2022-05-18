import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ListItem, List, ListProps, ListItemProps } from '@shared/atoms/Lists'

export default {
  title: 'Component/@shared/atoms/Lists',
  component: List,
  subcomponent: ListItem
} as ComponentMeta<typeof List>

const Template: ComponentStory<typeof List> = (args) => (
  <List {...args}>
    <ListItem />
  </List>
)

interface Props {
  args: ListProps
}

export const Default: Props = Template.bind({})
Default.args = {
  items: [
    <a key="first" href="https://oceanprotocol.com">
      List item short
    </a>,
    <a key="second">
      List item long ipsum dolor sit amet, consectetur adipiscing elit. Mauris
      aliquam facilisis molestie
    </a>,
    <a key="third" href="#">
      List item long ipsum dolor sit amet, consectetur adipiscing elit
    </a>
  ]
}

export const OrderedListItem: Props = Template.bind({})
OrderedListItem.args = {
  items: [
    <a key="first" href="https://oceanprotocol.com">
      List item short
    </a>,
    <a key="second">
      List item long ipsum dolor sit amet, consectetur adipiscing elit. Mauris
      aliquam facilisis molestie
    </a>,
    <a key="third" href="#">
      List item long ipsum dolor sit amet, consectetur adipiscing elit
    </a>
  ],
  ordered: true
}
