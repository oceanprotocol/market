import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ButtonBuy, { ButtonBuyProps } from '@shared/ButtonBuy'

export default {
  title: 'Component/@shared/ButtonBuy',
  component: ButtonBuy
} as ComponentMeta<typeof ButtonBuy>

const Template: ComponentStory<typeof ButtonBuy> = (args: ButtonBuyProps) => (
  <ButtonBuy {...args} />
)

interface Props {
  args: ButtonBuyProps
}

export const Default: Props = Template.bind({})
Default.args = {
  action: 'compute',
  disabled: false,
  hasPreviousOrder: true,
  hasDatatoken: true,
  dtSymbol: 'TOPLEN-30',
  dtBalance: '10',
  datasetLowPoolLiquidity: true,
  assetType: 'dataset',
  assetTimeout: '1 day',
  isConsumable: true,
  consumableFeedback: 'ok',
  isBalanceSufficient: true
}

export const WithType = Template.bind({})
WithType.args = {
  ...Default.args,
  type: 'submit'
}
