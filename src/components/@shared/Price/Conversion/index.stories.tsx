import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Conversion, { ConversionProps } from '@shared/Price/Conversion'
import {
  locale,
  currency,
  prices
} from '../../../../../.storybook/__mockdata__'

export default {
  title: 'Component/@shared/Price/Conversion',
  component: Conversion
} as ComponentMeta<typeof Conversion>

const Template: ComponentStory<typeof Conversion> = (args: ConversionProps) => {
  return <Conversion {...args} />
}

interface Props {
  args: ConversionProps
}

export const Default: Props = Template.bind({})
Default.args = {
  price: '11.12333',
  locale,
  currency,
  prices
}

export const HideApproximateSymbol: Props = Template.bind({})
HideApproximateSymbol.args = {
  price: '11.12333',
  locale,
  currency,
  prices,
  hideApproximateSymbol: true
}
