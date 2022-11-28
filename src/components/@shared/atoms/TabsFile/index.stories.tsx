import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tabs, { TabsProps } from '@shared/atoms/Tabs'

export default {
  title: 'Component/@shared/atoms/Tabs',
  component: Tabs
} as ComponentMeta<typeof Tabs>

const Template: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />

interface Props {
  args: TabsProps
}

const items = [
  {
    title: 'First tab',
    content: 'this is the content for the first tab'
  },
  {
    title: 'Second tab',
    content: 'this is the content for the second tab'
  },
  {
    title: 'Third tab',
    content: 'this is the content for the third tab'
  }
]

export const Default = Template.bind({})
Default.args = {
  items
}

export const WithRadio: Props = Template.bind({})
WithRadio.args = {
  items,
  showRadio: true
}

export const WithDefaultIndex: Props = Template.bind({})
WithDefaultIndex.args = {
  items,
  defaultIndex: 1
}

export const LotsOfTabs: Props = Template.bind({})
LotsOfTabs.args = {
  items: items.flatMap((i) => [i, i, i])
}
