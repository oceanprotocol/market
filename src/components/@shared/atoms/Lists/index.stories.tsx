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

const items = [
  'List item short',
  'List item long ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie',
  'List item long ipsum dolor sit amet, consectetur adipiscing elit',
  'List item short',
  'List item long ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam facilisis molestie',
  'List item long ipsum dolor sit amet, consectetur adipiscing elit'
]

export const Unordered = Template.bind({})
Unordered.decorators = [
  () => (
    <ul>
      {items.map((item, key) => (
        <Template key={key}>{item}</Template>
      ))}
    </ul>
  )
]

export const Ordered = Template.bind({})
Ordered.decorators = [
  () => (
    <ol>
      {items.map((item, key) => (
        <Template ol key={key}>
          {item}
        </Template>
      ))}
    </ol>
  )
]
