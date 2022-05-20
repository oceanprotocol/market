import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Blockies, { BlockiesProps } from '@shared/atoms/Blockies'

export default {
  title: 'Component/@shared/atoms/Blockies',
  component: Blockies
} as ComponentMeta<typeof Blockies>

const Template: ComponentStory<typeof Blockies> = (args) => (
  <Blockies {...args} />
)

interface Props {
  args: BlockiesProps
}

export const Default: Props = Template.bind({})
Default.args = {
  accountId: '0x1xxxxxxxxxx3Exxxxxx7xxxxxxxxxxxxF1fd'
}
