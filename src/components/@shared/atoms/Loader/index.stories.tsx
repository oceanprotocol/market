import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Loader from '@shared/atoms/Loader/index'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Loader',
  component: Loader
} as ComponentMeta<typeof Loader>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Loader> = (args) => <Loader {...args} />

interface Props {
  args: {
    noWordmark: boolean
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  noWordmark: true
}
