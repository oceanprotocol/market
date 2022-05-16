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

export const Default: Props = Template.bind({})
Default.args = {
  items: [
    {
      title: 'First tab',
      content: (
        <>
          <a href="https://oceanprotocol.com/" target="_blank" rel="noreferrer">
            this is the content for the first tab
          </a>
        </>
      )
    },
    {
      title: 'Second tab',
      content: (
        <>
          <a>this is the content for the second tab</a>
        </>
      )
    },
    {
      title: 'Third tab',
      content: (
        <>
          <a
            href="https://docs.oceanprotocol.com/"
            target="_blank"
            rel="noreferrer"
          >
            this is the content for the third tab
          </a>
        </>
      )
    }
  ]
}

export const WithRadio: Props = Template.bind({})
WithRadio.args = {
  items: [
    {
      title: 'First tab',
      content: (
        <>
          <a href="https://oceanprotocol.com/" target="_blank" rel="noreferrer">
            this is the content for the first tab
          </a>
        </>
      )
    },
    {
      title: 'Second tab',
      content: (
        <>
          <a>this is the content for the second tab</a>
        </>
      )
    }
  ],
  showRadio: true
}

export const WithDefaultIndex: Props = Template.bind({})
WithDefaultIndex.args = {
  items: [
    {
      title: 'First tab',
      content: (
        <>
          <a href="https://oceanprotocol.com/" target="_blank" rel="noreferrer">
            this is the content for the first tab
          </a>
        </>
      )
    },
    {
      title: 'Second tab',
      content: (
        <>
          <a>this is the content for the second tab</a>
        </>
      )
    },
    {
      title: 'Third tab',
      content: (
        <>
          <a
            href="https://docs.oceanprotocol.com/"
            target="_blank"
            rel="noreferrer"
          >
            this is the content for the third tab
          </a>
        </>
      )
    }
  ],
  defaultIndex: 1
}
