import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Conversion, { ConversionProps } from '@shared/Price/Conversion'
import { usePrices } from '@context/Prices'
import { useUserPreferences } from '@context/UserPreferences'

export default {
  title: 'Component/@shared/Price/Conversion',
  component: Conversion
} as ComponentMeta<typeof Conversion>

const Template: ComponentStory<typeof Conversion> = (args: ConversionProps) => {
  const { prices } = usePrices()
  const { currency, locale } = useUserPreferences()

  console.log('PRICES: ', prices)
  if (!prices || !currency || !locale) return

  return <Conversion {...args} />
}

interface Props {
  args: ConversionProps
}

export const Default: Props = Template.bind({})
Default.args = {
  price: '11.12333'
}

export const HideApproximateSymbol: Props = Template.bind({})
HideApproximateSymbol.args = {
  price: '11.12333',
  hideApproximateSymbol: true
}
