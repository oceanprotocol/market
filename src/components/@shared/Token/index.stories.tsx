import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Token, { TokenProps } from '@shared/Token'
import { locale, currency, prices } from '../../../../.storybook/__mockdata__'

export default {
  title: 'Component/@shared/Token',
  component: Token
} as ComponentMeta<typeof Token>

const Template: ComponentStory<typeof Token> = (args: TokenProps) => {
  return <Token {...args} />
}

interface Props {
  args: TokenProps
}

export const Default: Props = Template.bind({})
Default.args = {
  symbol: 'ETH',
  balance: '1',
  locale,
  currency,
  prices
}
