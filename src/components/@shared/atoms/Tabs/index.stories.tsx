import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tabs, { TabsItem } from '@shared/atoms/Tabs'
import styles from './index.module.css'

export default {
  title: 'Component/@shared/atoms/Tabs',
  component: Tabs
} as ComponentMeta<typeof Tabs>

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
    console.log('Tab selected!')
  }
}
