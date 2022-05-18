import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ListItem, ListItemProps } from '@shared/atoms/Lists'

export default {
  title: 'Component/@shared/atoms/Lists',
  component: ListItem,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof ListItem>

const Template: ComponentStory<typeof ListItem> = (args) => (
  <ListItem {...args} />
)

interface Props {
  args: ListItemProps
}

const items = [
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

export const Default = Template.bind({})
Default.args = {
  ol: true
}
Default.decorators = [
  () => (
    <>
      {items.map((item, key) => (
        <ListItem key={key}> {item} </ListItem>
      ))}
    </>
  )
]
