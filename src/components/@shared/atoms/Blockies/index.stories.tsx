import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Blockies from '@shared/atoms/Blockies'
import styles from './index.module.css'

export default {
  title: 'Component/@shared/atoms/Blockies',
  component: Blockies
} as ComponentMeta<typeof Blockies>

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
Primary.args = {
  accountId: '0x1xxxxxxxxxx3Exxxxxx7xxxxxxxxxxxxF1fd',
  className: styles.blockies || 'className'
}
