import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Blockies from '@shared/atoms/Blockies/index'
import styles from './index.module.css'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Component/@shared/atoms/Blockies',
  component: Blockies
} as ComponentMeta<typeof Blockies>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Blockies> = (args) => (
  <Blockies {...args} />
)

interface Props {
  args: {
    accountId: string
    className: string
  }
}

export const Primary: Props = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  accountId: '0x1xxxxxxxxxx3Exxxxxx7xxxxxxxxxxxxF1fd',
  className: styles.blockies || 'className'
}
