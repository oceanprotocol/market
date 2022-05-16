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
          <a>this is the content for the first tab</a>
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
          <a>this is the content for the first tab</a>
        </>
      )
    }
  ],
  showRadio: true
}
