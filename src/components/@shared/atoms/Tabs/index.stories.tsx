import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tabs, { TabsItem } from '@shared/atoms/Tabs/index'
import styles from './index.module.css'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Tabs',
  component: Tabs
} as ComponentMeta<typeof Tabs>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />

interface Props {
  args: {
    items: TabsItem
    className: string
    handleTabChange: any
    defaultIndex: number
    showRadio: boolean
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  items: {
    title: 'Tab',
    content: 'Tab Content',
    disabled: true
  },
  className: styles.tabs || 'className',
  defaultIndex: 0,
  showRadio: true,
  handleTabChange: () => {
    console.log('Tab pressed!')
  }
}
